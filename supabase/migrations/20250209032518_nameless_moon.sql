/*
  # Initial Schema Setup

  1. Tables
    - users (extends auth.users)
    - assignments
    - rubrics
    - submissions
    - grades

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
    - Set up role validation trigger
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('student', 'faculty')),
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  max_score integer NOT NULL,
  allow_late_submissions boolean DEFAULT false,
  file_types text[] DEFAULT ARRAY['pdf', 'txt']
);

-- Rubrics table
CREATE TABLE IF NOT EXISTS rubrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id uuid REFERENCES assignments(id),
  criteria text NOT NULL,
  max_points integer NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id uuid REFERENCES assignments(id),
  student_id uuid REFERENCES users(id),
  file_url text,
  content text,
  submitted_at timestamptz DEFAULT now(),
  originality_score float,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'grading', 'completed')),
  is_late boolean DEFAULT false
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id uuid REFERENCES submissions(id),
  graded_by uuid REFERENCES users(id),
  score float NOT NULL,
  feedback text,
  graded_at timestamptz DEFAULT now(),
  rubric_scores jsonb
);

-- Function to update is_late flag
CREATE OR REPLACE FUNCTION update_submission_is_late()
RETURNS TRIGGER AS $$
BEGIN
  SELECT (NEW.submitted_at > assignments.due_date)
  INTO NEW.is_late
  FROM assignments
  WHERE assignments.id = NEW.assignment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update is_late flag
CREATE TRIGGER update_submission_is_late_trigger
  BEFORE INSERT OR UPDATE OF submitted_at, assignment_id
  ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_submission_is_late();

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Assignments policies
CREATE POLICY "Anyone can view assignments"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Faculty can create assignments"
  ON assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'faculty'
    )
  );

-- Submissions policies
CREATE POLICY "Students can create own submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can view authorized submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'faculty'
    )
  );

-- Grades policies
CREATE POLICY "Faculty can create grades"
  ON grades
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'faculty'
    )
  );

CREATE POLICY "Users can view authorized grades"
  ON grades
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions
      WHERE submissions.id = submission_id
      AND (
        submissions.student_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
          AND role = 'faculty'
        )
      )
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION check_user_role()
RETURNS trigger AS $$
BEGIN
  IF NEW.role NOT IN ('student', 'faculty') THEN
    RAISE EXCEPTION 'Invalid role specified';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_valid_role
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION check_user_role();