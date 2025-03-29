import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface OriginalityReportProps {
  score: number;
  matches?: Array<{
    text: string;
    similarity: number;
    source?: string;
  }>;
}

export default function OriginalityReport({ score, matches = [] }: OriginalityReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 70) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg ${getScoreBackground(score)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Originality Score
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Based on our plagiarism detection analysis
            </p>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </div>
        </div>

        <div className="mt-4">
          {score >= 90 ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>This submission appears to be original</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>Some potential matches were found</span>
            </div>
          )}
        </div>
      </div>

      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Similar Content Found
          </h3>
          {matches.map((match, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {match.source || 'Unknown Source'}
                </span>
                <span className="text-sm text-gray-500">
                  {match.similarity}% similar
                </span>
              </div>
              <blockquote className="text-sm text-gray-600 border-l-4 border-gray-200 pl-4">
                {match.text}
              </blockquote>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}