import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizService, type Quiz, type Question } from "../services/quizService";
import { ArrowRight } from "lucide-react";

type Option = { id: string; text: string };

export default function QuizTaker() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<
    Record<string, Option[]>
  >({});

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;
      try {
        const quiz = await quizService.getQuizById(quizId);
        setQuiz(quiz);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Shuffle array helper function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize shuffled questions and options
  useEffect(() => {
    if (quiz) {
      const shuffled = shuffleArray(quiz.questions);
      setShuffledQuestions(shuffled);

      const options: Record<string, Option[]> = {};
      shuffled.forEach((question) => {
        if (question.options && question.id) {
          options[question.id as string] = shuffleArray(question.options);
        }
      });
      setShuffledOptions(options);
    }
  }, [quiz]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id as string]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      const results = await quizService.submitQuiz(quiz.id!, answers);

      if (
        Object.values(results.evaluationResults?.plagiarism_scores || {}).some(
          (score) => score > 7
        )
      ) {
        alert("High plagiarism detected in your answers. Please review.");
      }

      navigate("/dashboard", {
        state: { submissionResults: results },
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (loading) return <div>Loading quiz...</div>;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Progress and Timer */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            {currentQuestion.question}
          </h2>
          <div className="text-sm text-gray-500">
            {currentQuestion.marks} points
          </div>
        </div>

        {/* Answer Section */}
        <div className="space-y-4 mb-8">
          {currentQuestion?.type === "multiple_choice" &&
          currentQuestion.id &&
          shuffledOptions[currentQuestion.id] ? (
            shuffledOptions[currentQuestion.id].map((option) => (
              <label
                key={option.id}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors
                  ${
                    answers[currentQuestion?.id ?? ""] === option.id
                      ? "border-[#3A6EA5] bg-[#3A6EA5]/10"
                      : "border-gray-200 hover:border-[#3A6EA5]"
                  }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion?.id}`}
                  value={option.id}
                  checked={answers[currentQuestion?.id ?? ""] === option.id}
                  onChange={() => handleAnswer(option.id)}
                  className="sr-only"
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))
          ) : (
            <textarea
              value={answers[currentQuestion?.id ?? ""] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full p-3 border rounded-lg focus:border-[#3A6EA5] focus:outline-none"
              rows={4}
              placeholder="Type your answer here..."
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 bg-[#3A6EA5] text-white px-6 py-2 rounded-lg hover:bg-[#004E98]"
          >
            {currentQuestionIndex === shuffledQuestions.length - 1
              ? "Submit"
              : "Next"}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
