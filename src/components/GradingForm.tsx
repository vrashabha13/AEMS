import React, { useState } from 'react';
import { gradeSubmission } from '../lib/assignments';
import type { Submission } from '../types';

interface GradingFormProps {
  submission: Submission;
  rubrics: Array<{
    id: string;
    criteria: string;
    max_points: number;
  }>;
  onGraded: () => void;
}

export default function GradingForm({ submission, rubrics, onGraded }: GradingFormProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
      
      await gradeSubmission({
        submission_id: submission.id,
        score: totalScore,
        feedback,
        rubric_scores: scores,
      });

      onGraded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleScoreChange = (rubricId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [rubricId]: score
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Grade Submission</h2>
        <p className="mt-1 text-sm text-gray-500">
          Evaluate the submission based on the rubric criteria below.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {rubrics.map((rubric) => (
            <div key={rubric.id} className="border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700">
                {rubric.criteria} (0-{rubric.max_points} points)
              </label>
              <input
                type="number"
                min="0"
                max={rubric.max_points}
                value={scores[rubric.id] || 0}
                onChange={(e) => handleScoreChange(rubric.id, Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Provide detailed feedback for the student..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-white ${
              submitting
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {submitting ? 'Submitting Grade...' : 'Submit Grade'}
          </button>
        </div>
      </form>
    </div>
  );
}