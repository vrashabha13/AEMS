import { supabase } from './supabase';
import type { Assignment, Submission } from '../types';

export async function getAssignments() {
  const { data, error } = await supabase
    .from('assignments')
    .select(`
      *,
      rubrics (*)
    `)
    .order('due_date', { ascending: true });
    
  if (error) throw error;
  return data;
}

export async function submitAssignment(submission: Omit<Submission, 'id' | 'submittedAt'>) {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      assignment_id: submission.assignmentId,
      content: submission.content,
      file_url: submission.fileUrl,
      status: 'pending'
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getSubmissionsByAssignment(assignmentId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      grades (*)
    `)
    .eq('assignment_id', assignmentId);
    
  if (error) throw error;
  return data;
}