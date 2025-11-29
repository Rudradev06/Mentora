import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  SkipForward,
  SkipBack,
  BookOpen,
  Download,
  CheckCircle,
  Circle,
  ArrowLeft,
  Menu,
  X,
  XCircle,
  Clock,
  FileText,
  Video,
  MessageSquare,
  Lightbulb,
  Target,
  Minimize
} from "lucide-react";

const CourseLearnPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  
  const videoElementRef = useRef(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourse(id);
      const courseData = response.data.course;
      
      // Check if user has access to the course (handle both ObjectId and populated objects)
      const isEnrolled = courseData.enrolledStudents.some(studentId => {
        const id = typeof studentId === 'object' ? studentId._id || studentId.id : studentId;
        return id.toString() === user.id.toString();
      });
      
      const isInstructor = courseData.instructor._id.toString() === user.id.toString();
      const isAdmin = user.role === "admin";
      const hasAccess = isEnrolled || isInstructor || isAdmin;
      
      if (!hasAccess) {
        console.log("Access check failed:", {
          isEnrolled,
          isInstructor,
          isAdmin,
          userId: user.id,
          enrolledStudents: courseData.enrolledStudents,
          instructorId: courseData.instructor._id
        });
        setError("You are not enrolled in this course");
        return;
      }

      setCourse(courseData);
      
      // Load saved progress (in a real app, this would come from the backend)
      const savedProgress = localStorage.getItem(`course_${id}_progress`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const completed = new Set(progress.completedLessons);
        setCompletedLessons(completed);
        setCurrentLessonIndex(progress.currentLesson || 0);
        
        // Check if course was already completed
        if (completed.size === courseData.content.length) {
          // Check if certificate was already generated
          const certificate = localStorage.getItem(`certificate_${id}`);
          if (certificate) {
            setCertificateGenerated(true);
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch course");
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = (lessonIndex) => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonIndex);
    setCompletedLessons(newCompleted);
    
    // Save progress
    const progress = {
      completedLessons: Array.from(newCompleted),
      currentLesson: currentLessonIndex
    };
    localStorage.setItem(`course_${id}_progress`, JSON.stringify(progress));

    // Check if all lessons are completed
    if (newCompleted.size === course.content.length) {
      setShowCompletionModal(true);
    }
  };

  const handleStartQuiz = () => {
    // Navigate to quiz page
    navigate(`/courses/${id}/quiz`);
  };

  const handleViewCertificate = () => {
    // Check if quiz was passed
    const quizResult = localStorage.getItem(`quiz_result_${id}`);
    if (!quizResult) {
      alert("You must complete and pass the quiz before getting your certificate!");
      return;
    }

    const result = JSON.parse(quizResult);
    if (!result.passed) {
      alert("You must pass the quiz (70% or higher) to get your certificate!");
      return;
    }

    // Generate and download certificate
    const certificateData = {
      courseName: course.title,
      studentName: user.name,
      completionDate: new Date().toLocaleDateString(),
      courseId: id,
      instructor: course.instructor.name,
      quizScore: result.score
    };
    
    localStorage.setItem(`certificate_${id}`, JSON.stringify(certificateData));
    setCertificateGenerated(true);
    
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

                 with a quiz score of ${result.score}%


Instructor: ${course.instructor.name}
Date: ${new Date().toLocaleDateString()}
Course ID: ${id}

This certificate verifies that the student has:
✓ Completed all ${course.content.length} lessons
✓ Passed the final quiz with ${result.score}%
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
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < course.content.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setVideoLoading(false);
      setVideoError(false);
      
      // Save current lesson progress
      const progress = {
        completedLessons: Array.from(completedLessons),
        currentLesson: currentLessonIndex + 1
      };
      localStorage.setItem(`course_${id}_progress`, JSON.stringify(progress));
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setVideoLoading(false);
      setVideoError(false);
    }
  };

  const calculateProgress = () => {
    if (!course || course.content.length === 0) return 0;
    return Math.round((completedLessons.size / course.content.length) * 100);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate("/courses")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course || course.content.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">No Content Available</h1>
          <p className="text-gray-300 mb-4">This course doesn't have any lessons yet.</p>
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const currentLesson = course.content[currentLessonIndex];
  const progress = calculateProgress();

  return (
    <div className={`h-screen flex flex-col ${focusMode ? 'bg-black' : 'bg-gray-900'} text-white transition-colors duration-300`}>
      {/* Header */}
      {!focusMode && (
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/courses/${id}`)}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Course
              </button>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-white">{course.title}</h1>
                <p className="text-sm text-gray-400">
                  Lesson {currentLessonIndex + 1} of {course.content.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-sm text-gray-400">
                  {completedLessons.size}/{course.content.length} completed
                </div>
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-semibold ${progress === 100 ? 'text-green-400' : 'text-gray-300'}`}>
                  {progress}%
                </span>
                {progress === 100 && (
                  <CheckCircle className="w-5 h-5 text-green-400 animate-pulse" />
                )}
              </div>
              
              {!completedLessons.has(currentLessonIndex) && (
                <button
                  onClick={() => markLessonComplete(currentLessonIndex)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Mark Lesson Complete"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Mark Complete</span>
                </button>
              )}
              
              <button
                onClick={() => setFocusMode(!focusMode)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Focus Mode"
              >
                <Target className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar - Course Content */}
        {!focusMode && (
          <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-800 border-r border-gray-700 overflow-hidden`}>
            <div className="p-4 h-full overflow-y-auto">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Course Content</h2>
                  <div className={`text-sm font-semibold ${
                    completedLessons.size === course.content.length ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {completedLessons.size}/{course.content.length}
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      calculateProgress() === 100 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                {completedLessons.size === course.content.length && (
                  <div className="text-xs text-green-400 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Course Completed!
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {course.content.map((lesson, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentLessonIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      index === currentLessonIndex
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {completedLessons.has(index) ? (
                          <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{lesson.title}</div>
                          {lesson.duration && (
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {lesson.duration}
                            </div>
                          )}
                        </div>
                      </div>
                      {lesson.videoUrl && <Video className="w-4 h-4 flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Focus Mode Toggle */}
          {focusMode && (
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setFocusMode(false)}
                className="p-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/80 transition-colors"
                title="Exit Focus Mode"
              >
                <Minimize className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Video Player - Full Height */}
          <div className="flex-1 flex items-center justify-center bg-black relative">
            {currentLesson.videoUrl ? (
              <div className="w-full h-full flex items-center justify-center px-20">
                <div className="relative w-full h-full">
                  <video
                    ref={videoElementRef}
                    controls
                    className="w-full h-full object-contain"
                    src={currentLesson.videoUrl}
                    onError={(e) => {
                      console.error("Video loading error:", e);
                      setVideoError(true);
                      setVideoLoading(false);
                    }}
                    onLoadStart={() => {
                      setVideoLoading(true);
                      setVideoError(false);
                    }}
                    onCanPlay={() => {
                      setVideoLoading(false);
                      setVideoError(false);
                    }}
                    onEnded={() => {
                      // Auto-mark lesson as complete when video ends
                      if (!completedLessons.has(currentLessonIndex)) {
                        markLessonComplete(currentLessonIndex);
                      }
                    }}
                    preload="metadata"
                  >
                        <source src={currentLesson.videoUrl} type="video/mp4" />
                        <source src={currentLesson.videoUrl} type="video/webm" />
                        <source src={currentLesson.videoUrl} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* Video Loading State */}
                      {videoLoading && (
                        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-white">Loading video...</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Video Error Fallback */}
                      {videoError && (
                        <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center text-white">
                          <Video className="w-16 h-16 text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Video Unavailable</h3>
                          <p className="text-gray-400 text-center max-w-md mb-4">
                            The video for this lesson is currently unavailable. Please try refreshing the page or contact support if the issue persists.
                          </p>
                          <button
                            onClick={() => {
                              setVideoError(false);
                              setVideoLoading(true);
                              const video = document.querySelector('video');
                              if (video) {
                                video.load();
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Retry
                          </button>
                        </div>
                  )}
                </div>

                {/* Navigation Buttons Overlay */}
                {/* Previous Button */}
                <button
                  onClick={goToPreviousLesson}
                  disabled={currentLessonIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-gray-900/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-800/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 z-10"
                  aria-label="Previous Lesson"
                >
                  <SkipBack className="w-6 h-6" />
                </button>



                {/* Next Button */}
                <button
                  onClick={goToNextLesson}
                  disabled={currentLessonIndex === course.content.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-gray-900/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-800/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 z-10"
                  aria-label="Next Lesson"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-center">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Video Available</h3>
                <p className="text-gray-400">
                  This lesson doesn't have a video component.
                </p>
              </div>
            )}
          </div>


        </div>
      </div>

      {/* Floating Take Quiz Button - Bottom Left */}
      {completedLessons.size === course.content.length && (
        <button
          onClick={handleStartQuiz}
          className="fixed bottom-6 left-6 z-40 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-2 hover:scale-105 font-semibold"
        >
          <FileText className="w-5 h-5" />
          <span>Take Quiz</span>
        </button>
      )}

      {/* Course Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-gray-700">
            <div className="text-center">
              {/* Celebration Icon */}
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
              </div>

              {/* Congratulations Message */}
              <h2 className="text-4xl font-bold text-white mb-4">
                🎉 Congratulations! 🎉
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                You've completed all lessons in
              </p>
              <p className="text-2xl font-semibold text-blue-400 mb-6">
                {course.title}
              </p>

              {/* Progress Stats */}
              <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-400">
                      {course.content.length}
                    </div>
                    <div className="text-sm text-gray-400">Lessons Completed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400">100%</div>
                    <div className="text-sm text-gray-400">Course Progress</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400">
                      {course.duration || "N/A"}
                    </div>
                    <div className="text-sm text-gray-400">Total Duration</div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4">
                <p className="text-gray-300 mb-6">
                  Complete the quiz to earn your certificate!
                </p>

                {/* Check if quiz was completed */}
                {(() => {
                  const quizResult = localStorage.getItem(`quiz_result_${id}`);
                  const quizData = quizResult ? JSON.parse(quizResult) : null;
                  const quizPassed = quizData?.passed;

                  return (
                    <div className="space-y-4">
                      {/* Quiz Button */}
                      {!quizPassed && (
                        <button
                          onClick={handleStartQuiz}
                          className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                        >
                          <FileText className="w-5 h-5 mr-2" />
                          {quizData ? "Retake Quiz" : "Take Quiz Test"}
                        </button>
                      )}

                      {/* Quiz Status */}
                      {quizData && (
                        <div className={`p-4 rounded-xl ${
                          quizPassed 
                            ? 'bg-green-900/30 border border-green-500/30' 
                            : 'bg-red-900/30 border border-red-500/30'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {quizPassed ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                              )}
                              <span className={quizPassed ? 'text-green-400' : 'text-red-400'}>
                                Quiz Score: {quizData.score}%
                              </span>
                            </div>
                            {quizPassed && (
                              <span className="text-green-400 text-sm">✓ Passed</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Certificate Button - Only show if quiz passed */}
                      {quizPassed && (
                        <button
                          onClick={handleViewCertificate}
                          className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          {certificateGenerated ? "Download Certificate Again" : "Download Certificate"}
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* Close Button */}
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="mt-4 px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Note */}
              <p className="text-sm text-gray-500 mt-6">
                💡 Pass the quiz with 70% or higher to earn your certificate
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLearnPage;