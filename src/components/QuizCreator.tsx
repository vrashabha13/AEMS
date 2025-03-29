import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Settings as SettingsIcon,
  ArrowLeft,
  Shuffle,
  Edit,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

type QuestionType =
  | "multiple_choice"
  | "checkbox"
  | "short_answer"
  | "paragraph"
  | "dropdown"
  | "subjective";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options: Option[];
  description?: string;
  marks: number;
  answer?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  randomize: boolean;
  scheduledDate?: string;
}

const initialQuestion: Question = {
  id: "1",
  type: "multiple_choice",
  title: "",
  required: false,
  options: [
    { id: "1", text: "Option 1" },
    { id: "2", text: "Option 2" },
  ],
  marks: 0,
};

export default function QuizCreator() {
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [title, setTitle] = useState("Untitled Quiz");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([initialQuestion]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [randomize, setRandomize] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: String(questions.length + 1),
      type: "multiple_choice",
      title: "",
      required: false,
      options: [
        { id: "1", text: "Option 1" },
        { id: "2", text: "Option 2" },
      ],
      marks: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [
              ...q.options,
              {
                id: String(q.options.length + 1),
                text: `Option ${q.options.length + 1}`,
              },
            ],
          };
        }
        return q;
      })
    );
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o) =>
              o.id === optionId ? { ...o, text } : o
            ),
          };
        }
        return q;
      })
    );
  };

  const deleteOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((o) => o.id !== optionId),
          };
        }
        return q;
      })
    );
  };

  const handleSaveQuiz = () => {
    setShowAssignModal(true);
  };

  const handleAssignQuiz = () => {
    const newQuiz: Quiz = {
      id: String(Date.now()),
      title,
      description,
      questions,
      randomize,
      scheduledDate:
        scheduleType === "later"
          ? `${scheduledDate}T${scheduledTime}`
          : new Date().toISOString(),
    };

    setQuizzes([...quizzes, newQuiz]);
    setShowAssignModal(false);
    setShowQuizForm(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("Untitled Quiz");
    setDescription("");
    setQuestions([initialQuestion]);
    setRandomize(false);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setTitle(quiz.title);
    setDescription(quiz.description);
    setQuestions(quiz.questions);
    setRandomize(quiz.randomize);
    setShowQuizForm(true);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(quizzes.filter((q) => q.id !== quizId));
  };

  if (!showQuizForm) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#004E98]">Quizzes</h1>
          <button
            onClick={() => setShowQuizForm(true)}
            className="bg-[#FF6700] text-white px-4 py-2 rounded-lg hover:bg-[#FF6700]/90"
          >
            Create Quiz
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg shadow p-6 group relative hover:shadow-lg transition-shadow"
            >
              <div className="absolute right-2 top-2 hidden group-hover:flex gap-2">
                <button
                  onClick={() => handleEditQuiz(quiz)}
                  className="p-2 bg-[#3A6EA5] text-white rounded-lg hover:bg-[#004E98]"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-500">{quiz.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                {quiz.questions.length} questions
                {quiz.randomize && " • Randomized"}
              </div>
              {quiz.scheduledDate &&
                new Date(quiz.scheduledDate) > new Date() && (
                  <div className="mt-2 text-sm text-[#3A6EA5]">
                    Scheduled for{" "}
                    {new Date(quiz.scheduledDate).toLocaleString()}
                  </div>
                )}
              <Link
                to={`/quiz/${quiz.id}`}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Take Quiz
              </Link>
            </div>
          ))}
          {quizzes.length === 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">No quizzes created yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setShowQuizForm(false);
            resetForm();
          }}
          className="flex items-center gap-2 text-[#3A6EA5] hover:text-[#004E98]"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Quizzes
        </button>
        <button
          onClick={() => setRandomize(!randomize)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            randomize
              ? "bg-[#3A6EA5] text-white"
              : "text-[#3A6EA5] border border-[#3A6EA5]"
          }`}
        >
          <Shuffle className="h-4 w-4" />
          {randomize ? "Randomized" : "Randomize Questions"}
        </button>
      </div>

      {/* Quiz Header */}
      <div className="bg-[#FF6700] rounded-t-lg p-6 mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold bg-transparent text-white placeholder-white/70 border-b border-white/30 focus:border-white focus:outline-none pb-2"
          placeholder="Quiz Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-4 bg-transparent text-white placeholder-white/70 border-b border-white/30 focus:border-white focus:outline-none resize-none"
          placeholder="Quiz Description"
          rows={2}
        />
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white rounded-lg shadow-sm border border-[#C0C0C0] p-6"
          >
            <div className="flex items-start gap-4">
              <GripVertical className="h-6 w-6 text-[#3A6EA5] cursor-move" />
              <div className="flex-1">
                <input
                  type="text"
                  value={question.title}
                  onChange={(e) =>
                    updateQuestion(question.id, { title: e.target.value })
                  }
                  className="w-full text-lg font-medium border-b border-[#EBEBEB] focus:border-[#3A6EA5] focus:outline-none pb-2"
                  placeholder={`Question ${index + 1}`}
                />

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Marks:</label>
                      <input
                        type="number"
                        min="0"
                        value={question.marks}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            marks: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-20 px-2 py-1 border rounded-md"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const type =
                          question.type === "multiple_choice"
                            ? "subjective"
                            : "multiple_choice";
                        updateQuestion(question.id, { type });
                      }}
                      className="text-[#3A6EA5] text-sm"
                    >
                      {question.type === "multiple_choice"
                        ? "Switch to Subjective"
                        : "Switch to Objective"}
                    </button>
                  </div>

                  {question.type === "multiple_choice" ? (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="radio"
                            disabled
                            className="text-[#3A6EA5] focus:ring-[#3A6EA5]"
                          />
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              updateOption(
                                question.id,
                                option.id,
                                e.target.value
                              )
                            }
                            className="flex-1 border-b border-[#EBEBEB] focus:border-[#3A6EA5] focus:outline-none"
                            placeholder="Option text"
                          />
                          <button
                            onClick={() => deleteOption(question.id, option.id)}
                            className="text-[#3A6EA5] hover:text-[#004E98]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(question.id)}
                        className="text-[#3A6EA5] hover:text-[#004E98] text-sm font-medium"
                      >
                        Add Option
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        placeholder="Enter the model answer..."
                        value={question.answer || ""}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            answer: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-md focus:border-[#3A6EA5] focus:outline-none"
                        rows={4}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="p-2 text-[#3A6EA5] hover:bg-[#EBEBEB] rounded"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button className="p-2 text-[#3A6EA5] hover:bg-[#EBEBEB] rounded">
                  <SettingsIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Button */}
      <button
        onClick={addQuestion}
        className="mt-4 flex items-center gap-2 text-[#3A6EA5] hover:bg-[#EBEBEB] rounded-lg px-4 py-2"
      >
        <Plus className="h-5 w-5" />
        <span>Add Question</span>
      </button>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveQuiz}
          className="bg-[#004E98] text-white px-6 py-2 rounded-lg hover:bg-[#3A6EA5]"
        >
          Save Quiz
        </button>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Quiz Options</h2>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 border border-[#3A6EA5] text-[#3A6EA5] rounded-lg hover:bg-[#EBEBEB]"
                >
                  Edit Quiz
                </button>
                <button
                  onClick={() => setScheduleType("now")}
                  className="flex-1 px-4 py-2 bg-[#FF6700] text-white rounded-lg hover:bg-[#FF6700]/90"
                >
                  Assign Quiz
                </button>
              </div>

              {scheduleType === "now" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Post immediately</span>
                    <button
                      onClick={() => setScheduleType("later")}
                      className="text-[#3A6EA5] text-sm"
                    >
                      Schedule for later
                    </button>
                  </div>
                  <button
                    onClick={handleAssignQuiz}
                    className="w-full px-4 py-2 bg-[#004E98] text-white rounded-lg hover:bg-[#3A6EA5]"
                  >
                    Post Now
                  </button>
                </div>
              )}

              {scheduleType === "later" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3A6EA5] focus:ring-[#3A6EA5]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3A6EA5] focus:ring-[#3A6EA5]"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setScheduleType("now")}
                      className="text-[#3A6EA5] text-sm"
                    >
                      Post immediately instead
                    </button>
                    <button
                      onClick={handleAssignQuiz}
                      className="px-4 py-2 bg-[#004E98] text-white rounded-lg hover:bg-[#3A6EA5]"
                    >
                      Schedule Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
