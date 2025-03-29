import { spawn } from 'child_process';
import path from 'path';
import { supabase } from '../lib/supabase';

export const handleQuizSubmission = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // 1. Save submission
    const { data: submission, error } = await supabase
      .from('quiz_submissions')
      .insert([{ quiz_id: quizId, answers }])
      .select()
      .single();

    if (error) throw error;

    // 2. Run evaluation asynchronously
    runEvaluation(submission.id, quizId, answers)
      .catch(console.error);

    res.json({ submissionId: submission.id, status: 'processing' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

async function runEvaluation(submissionId: string, quizId: string, answers: Record<string, string>) {
  try {
    // Get quiz details for evaluation
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    // Run evaluation script
    const evalProcess = spawn('python', [
      path.join(__dirname, '../../evaluation/evaluation.py')
    ], {
      env: {
        ...process.env,
        QUIZ_DATA: JSON.stringify({ quiz, answers })
      }
    });

    let evaluationResults = '';
    evalProcess.stdout.on('data', (data) => {
      evaluationResults += data;
    });

    await new Promise((resolve, reject) => {
      evalProcess.on('close', resolve);
      evalProcess.on('error', reject);
    });

    // Parse and save results
    const results = JSON.parse(evaluationResults);
    await supabase
      .from('quiz_submissions')
      .update({ evaluation_results: results })
      .eq('id', submissionId);

  } catch (error) {
    console.error('Evaluation error:', error);
    throw error;
  }
} 