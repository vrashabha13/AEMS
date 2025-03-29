import React, { useState } from 'react';
import { X, Upload, Calendar, Clock, Users } from 'lucide-react';
import { FileUpload } from './FileUpload';

interface AssignmentCreatorProps {
  onClose: () => void;
  onSubmit: (assignment: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

export default function AssignmentCreator({ onClose, onSubmit, initialData, isEditing = false }: AssignmentCreatorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate?.split('T')[0] || '');
  const [dueTime, setDueTime] = useState(initialData?.dueDate?.split('T')[1] || '');
  const [points, setPoints] = useState(initialData?.points?.toString() || '100');
  const [files, setFiles] = useState<File[]>(initialData?.files || []);
  const [selectedClass, setSelectedClass] = useState(initialData?.class || 'all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignment = {
      id: initialData?.id,
      title,
      description,
      dueDate: `${dueDate}T${dueTime}`,
      points: parseInt(points),
      files,
      class: selectedClass,
    };

    onSubmit(assignment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#004E98]">
              {isEditing ? 'Edit Assignment' : 'Create Assignment'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Assignment Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg border-b-2 border-[#EBEBEB] focus:border-[#3A6EA5] focus:outline-none py-2"
                required
              />
            </div>

            <div>
              <textarea
                placeholder="Instructions (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg p-3 focus:border-[#3A6EA5] focus:outline-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="pl-10 w-full border rounded-lg p-2 focus:border-[#3A6EA5] focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="pl-10 w-full border rounded-lg p-2 focus:border-[#3A6EA5] focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
              <input
                type="number"
                min="0"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-32 border rounded-lg p-2 focus:border-[#3A6EA5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="pl-10 w-full border rounded-lg p-2 focus:border-[#3A6EA5] focus:outline-none"
                >
                  <option value="all">All Classes</option>
                  <option value="cse">Computer Science</option>
                  <option value="ece">Electronics</option>
                  <option value="dsai">Data Science</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
              <FileUpload
                onFileSelect={(file) => setFiles([...files, file])}
                acceptedFileTypes={['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
              />
              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#3A6EA5] text-[#3A6EA5] rounded-lg hover:bg-[#EBEBEB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF6700] text-white rounded-lg hover:bg-[#FF6700]/90"
              >
                {isEditing ? 'Save Changes' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}