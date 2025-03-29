import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { VoiceInput } from './VoiceInput';
import { submitAssignment } from '../lib/assignments';
import type { Assignment } from '../types';

interface AssignmentSubmissionProps {
  assignment: Assignment;
  onSubmit: () => void;
}

export default function AssignmentSubmission({ assignment, onSubmit }: AssignmentSubmissionProps) {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!content && !file) {
        throw new Error('Please provide either text content or upload a file');
      }

      // TODO: Implement file upload to storage
      const fileUrl = file ? 'temporary-url' : null;

      await submitAssignment({
        assignment_id: assignment.id,
        content,
        file_url: fileUrl,
      });

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setContent((prev) => prev + ' ' + transcript);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Submit Assignment</h2>
        <p className="mt-1 text-sm text-gray-500">
          You can either type your submission, use voice input, or upload a file.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="mt-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Type or use voice input to enter your submission..."
            />
          </div>
        </div>

        <div>
          <VoiceInput onTranscript={handleVoiceInput} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Or Upload a File
          </label>
          <div className="mt-1">
            <FileUpload
              onFileSelect={setFile}
              acceptedFileTypes={assignment.file_types}
            />
          </div>
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
            {submitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}