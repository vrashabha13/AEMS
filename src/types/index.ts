import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface User extends SupabaseUser {
  role: 'student' | 'faculty'
  full_name: string
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  originalityScore?: number;
  feedback?: string;
  submittedAt?: string;
  maxScore: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  content: string;
  fileUrl?: string;
  submittedAt: string;
  grade?: number;
  originalityScore?: number;
  feedback?: string;
}