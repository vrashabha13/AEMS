export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assignments: {
        Row: {
          id: string
          title: string
          description: string | null
          due_date: string
          created_by: string
          created_at: string
          updated_at: string
          max_score: number
          allow_late_submissions: boolean
          file_types: string[]
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          due_date: string
          created_by: string
          created_at?: string
          updated_at?: string
          max_score: number
          allow_late_submissions?: boolean
          file_types?: string[]
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          due_date?: string
          created_by?: string
          created_at?: string
          updated_at?: string
          max_score?: number
          allow_late_submissions?: boolean
          file_types?: string[]
        }
      }
      grades: {
        Row: {
          id: string
          submission_id: string
          graded_by: string
          score: number
          feedback: string | null
          graded_at: string
          rubric_scores: Json | null
        }
        Insert: {
          id?: string
          submission_id: string
          graded_by: string
          score: number
          feedback?: string | null
          graded_at?: string
          rubric_scores?: Json | null
        }
        Update: {
          id?: string
          submission_id?: string
          graded_by?: string
          score?: number
          feedback?: string | null
          graded_at?: string
          rubric_scores?: Json | null
        }
      }
      rubrics: {
        Row: {
          id: string
          assignment_id: string
          criteria: string
          max_points: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          criteria: string
          max_points: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          criteria?: string
          max_points?: number
          description?: string | null
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          file_url: string | null
          content: string | null
          submitted_at: string
          originality_score: number | null
          status: string
          is_late: boolean
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          file_url?: string | null
          content?: string | null
          submitted_at?: string
          originality_score?: number | null
          status?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          file_url?: string | null
          content?: string | null
          submitted_at?: string
          originality_score?: number | null
          status?: string
        }
      }
      users: {
        Row: {
          id: string
          role: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}