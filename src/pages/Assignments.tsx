import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { getAssignments } from "../lib/assignments";
import AssignmentCreator from "../components/AssignmentCreator";
import type { Assignment } from "../types";

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const data = await getAssignments();
        setAssignments(data);
      } catch (error) {
        console.error("Error loading assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  const handleCreateAssignment = async (assignment: any) => {
    try {
      const newAssignment: Assignment = {
        id: assignment.id || String(Date.now()),
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        status: "pending" as const,
        maxScore: parseInt(assignment.points),
      };

      if (editingAssignment) {
        // Update existing assignment
        setAssignments(
          assignments.map((a) =>
            a.id === editingAssignment.id ? newAssignment : a
          )
        );
      } else {
        // Create new assignment
        setAssignments([...assignments, newAssignment]);
      }

      setEditingAssignment(null);
    } catch (error) {
      console.error("Error with assignment:", error);
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setShowCreator(true);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter((a) => a.id !== assignmentId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A6EA5]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#004E98]">Assignments</h1>
        <button
          onClick={() => {
            setEditingAssignment(null);
            setShowCreator(true);
          }}
          className="flex items-center gap-2 bg-[#FF6700] text-white px-4 py-2 rounded-lg hover:bg-[#FF6700]/90"
        >
          <Plus className="h-5 w-5" />
          Create Assignment
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => {
          const dueDate = new Date(assignment.dueDate);
          const isOverdue = dueDate < new Date();

          return (
            <div
              key={assignment.id}
              className="group bg-white rounded-lg shadow-sm border border-[#C0C0C0] p-6 hover:shadow-md transition-shadow relative"
            >
              {/* Edit and Delete buttons */}
              <div className="absolute right-2 top-2 hidden group-hover:flex gap-2">
                <button
                  onClick={() => handleEditAssignment(assignment)}
                  className="p-2 bg-[#3A6EA5] text-white rounded-lg hover:bg-[#004E98]"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-[#3A6EA5]" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {assignment.title}
                  </h3>
                </div>
                {isOverdue ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-400" />
                )}
              </div>

              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {assignment.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Due {format(dueDate, "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>{assignment.maxScore} points</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-3">
                <button className="flex-1 bg-[#EBEBEB] text-[#3A6EA5] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#C0C0C0]">
                  View Details
                </button>
                <button className="flex-1 bg-[#3A6EA5] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#004E98]">
                  Submit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showCreator && (
        <AssignmentCreator
          onClose={() => {
            setShowCreator(false);
            setEditingAssignment(null);
          }}
          onSubmit={handleCreateAssignment}
          initialData={editingAssignment}
          isEditing={!!editingAssignment}
        />
      )}
    </div>
  );
}
