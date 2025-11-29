import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Clock,
  Award,
  AlertCircle,
  Download
} from "lucide-react";

const CourseQuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  // Sample quiz questions (in production, these would come from the backend)
  const quizQuestions = [
    {
      question: "What is the main topic covered in this course?",
      options: ["Web Development", "Data Science", "Mobile Development", "Cloud Computing"],
      correctAnswer: 0
    },
    {
      question: "Which concept is most important for this course?",
      options: ["Theory", "Practice", "Both Theory and Practice", "None"],
      correctAnswer: 2
    },
    {
      question: "What is the recommended approach for learning?",
      options: ["Watch videos only", "Practice exercises", "Take notes", "All of the above"],
      correctAnswer: 3
    },
    {
      question: "How many lessons did you complete?",
      options: ["Less than 5", "5-10", "More than 10", "All lessons"],
      correctAnswer: 3
    },
    {
      question: "What is the best way to retain knowledge?",
      options: ["Memorization", "Understanding concepts", "Regular practice", "Both B and C"],
      correctAnswer: 3
    }
  ];

  useEffect(() => {
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz();
    }
  }, [quizStarted, quizCompleted, timeLeft]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getCourse(id);
      setCourse(response.data.course);
      
      // Check if all lessons are completed
      const savedProgress = localStorage.getItem(`course_${id}_progress`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const completedCount = progress.completedLessons?.length || 0;
        const totalLessons = response.data.course.content.length;
        
        if (completedCount < totalLessons) {
          alert(`You must complete all ${totalLessons} lessons before taking the quiz! (${completedCount}/${totalLessons} completed)`);
          navigate(`/courses/${id}/learn`);
          return;
        }
      } else {
        alert("You must complete all lessons before taking the quiz!");
        navigate(`/courses/${id}/learn`);
        return;
      }
    } catch (err) {
      console.error("Failed to fetch course:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    quizQuestions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);

    // Save quiz result
    const quizResult = {
      courseId: id,
      courseName: course.title,
      score: finalScore,
      completedAt: new Date().toISOString(),
      passed: finalScore >= 70
    };
    localStorage.setItem(`quiz_result_${id}`, JSON.stringify(quizResult));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(`/courses/${id}/learn`)}
            className="flex items-center text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Course
          </button>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <Award className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Course Quiz</h1>
              <p className="text-xl text-gray-300">{course?.title}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Total Questions</span>
                <span className="font-semibold">{quizQuestions.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Time Limit</span>
                <span className="font-semibold">30 minutes</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Passing Score</span>
                <span className="font-semibold">70%</span>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold mb-2">Instructions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Answer all questions to the best of your ability</li>
                    <li>You can navigate between questions</li>
                    <li>The quiz will auto-submit when time runs out</li>
                    <li>You need 70% or higher to pass</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => setQuizStarted(true)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const passed = score >= 70;
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {passed ? (
                <CheckCircle className="w-16 h-16 text-green-400" />
              ) : (
                <XCircle className="w-16 h-16 text-red-400" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">
              {passed ? "Congratulations! 🎉" : "Quiz Completed"}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {passed ? "You passed the quiz!" : "You didn't pass this time, but you can try again!"}
            </p>

            <div className="bg-gray-700/50 rounded-xl p-6 mb-8">
              <div className="text-5xl font-bold mb-2" style={{ color: passed ? '#10b981' : '#ef4444' }}>
                {score}%
              </div>
              <div className="text-gray-400">Your Score</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  {Object.values(answers).filter((ans, idx) => ans === quizQuestions[idx].correctAnswer).length}
                </div>
                <div className="text-sm text-gray-400">Correct</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400">
                  {quizQuestions.length - Object.values(answers).filter((ans, idx) => ans === quizQuestions[idx].correctAnswer).length}
                </div>
                <div className="text-sm text-gray-400">Incorrect</div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Download Certificate Button - Only if passed */}
              {passed && (
                <button
                  onClick={() => {
                    // Generate and download certificate
                    const certificateData = {
                      courseName: course.title,
                      studentName: user.name,
                      completionDate: new Date().toLocaleDateString(),
                      courseId: id,
                      instructor: course.instructor.name,
                      quizScore: score
                    };
                    
                    localStorage.setItem(`certificate_${id}`, JSON.stringify(certificateData));
                    
                    // Download certificate
                    const certificateText = `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              CERTIFICATE OF COMPLETION                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

                    This certifies that

                      ${user.name}

        has successfully completed the course

                    ${course.title}

                 with a quiz score of ${score}%


Instructor: ${course.instructor.name}
Date: ${new Date().toLocaleDateString()}
Course ID: ${id}

This certificate verifies that the student has:
✓ Completed all course lessons
✓ Passed the final quiz with ${score}%
✓ Demonstrated understanding of course material

────────────────────────────────────────────────────────────
                    Mentora Learning Platform
    `;
                    
                    const blob = new Blob([certificateText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${course.title.replace(/\s+/g, '_')}_Certificate.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    alert("Certificate downloaded successfully! 🎉");
                  }}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Certificate</span>
                </button>
              )}

              <button
                onClick={() => navigate(`/courses/${id}`)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Course
              </button>
              
              {/* Retake Quiz Button - Always available */}
              <button
                onClick={() => {
                  setQuizStarted(false);
                  setQuizCompleted(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                  setTimeLeft(1800);
                }}
                className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <div className="w-48 bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-yellow-400">
            <Clock className="w-5 h-5" />
            <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-6">
          <h2 className="text-2xl font-semibold mb-8">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  answers[currentQuestion] === index
                    ? 'bg-blue-600 text-white border-2 border-blue-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    answers[currentQuestion] === index ? 'border-white bg-white' : 'border-gray-400'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentQuestion === quizQuestions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseQuizPage;
