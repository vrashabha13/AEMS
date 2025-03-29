import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Question {
    id?: string;
    question: string;
    options: {
        id: string;
        text: string;
    }[];
    correctAnswer: string;
    type: 'multiple_choice' | 'subjective';
    marks: number;
}

export interface Quiz {
    id?: string;
    title: string;
    description: string;
    questions: Question[];
    randomize: boolean;
    scheduledDate?: string;
    created_at?: string;
    status: 'draft' | 'published';
}

export interface QuizSubmission {
    quizId: string;
    answers: Record<string, string>;
    evaluationResults?: {
        score: number;
        feedback: {
            question_id: string;
            feedback: string;
        }[];
        plagiarism_scores: Record<string, number>;
    };
}

interface EvaluationResults {
    score: number;
    feedback: {
        question_id: string;
        feedback: string;
    }[];
    plagiarism_scores: Record<string, number>;
}

export const quizService = {
    async createQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>) {
        try {
            const { data, error } = await supabase
                .from('quizzes')
                .insert([quiz])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating quiz:', error);
            throw error;
        }
    },

    async getQuizzes() {
        try {
            const { data, error } = await supabase
                .from('quizzes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            throw error;
        }
    },

    async deleteQuiz(quizId: string) {
        try {
            const { error } = await supabase
                .from('quizzes')
                .delete()
                .eq('id', quizId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting quiz:', error);
            throw error;
        }
    },

    async updateQuiz(quizId: string, updates: Partial<Quiz>) {
        try {
            const { error } = await supabase
                .from('quizzes')
                .update(updates)
                .eq('id', quizId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating quiz:', error);
            throw error;
        }
    },

    async getQuizById(quizId: string) {
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', quizId)
            .single();

        if (error) throw error;
        return data;
    },

    async submitQuiz(quizId: string, answers: Record<string, string>): Promise<QuizSubmission> {
        try {
            // Submit answers to backend
            const { data, error } = await supabase
                .from('quiz_submissions')
                .insert([{
                    quiz_id: quizId,
                    answers,
                    submitted_at: new Date().toISOString()
                }])
                .select('*, evaluation_results')
                .single();

            if (error) throw error;

            // Wait for evaluation results
            const evaluationResults = await this.pollEvaluationResults(data.id);

            return {
                quizId,
                answers,
                evaluationResults
            };
        } catch (error) {
            console.error('Error submitting quiz:', error);
            throw error;
        }
    },

    async pollEvaluationResults(submissionId: string, maxAttempts = 10): Promise<EvaluationResults> {
        for (let i = 0; i < maxAttempts; i++) {
            const { data, error } = await supabase
                .from('quiz_submissions')
                .select('evaluation_results')
                .eq('id', submissionId)
                .single();

            if (error) throw error;
            if (data?.evaluation_results) return data.evaluation_results;

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        throw new Error('Evaluation timed out');
    }
}; 