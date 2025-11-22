import { useState, useEffect } from "react";
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
  Clock,
  FileText,
  Video,
  Maximize,
  Minimize,
  Volume2,
  MessageSquare,
  Lightbulb,
  Target
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [focusMode, setFocusMode] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourse(id);
      const courseData = response.data.course;
      
      // Check if user has access to the course
      const hasAccess = courseData.enrolledStudents.some(studentId => studentId.toString() === user.id.toString()) || 
                       courseData.instructor._id.toString() === user.id.toString() || 
                       user.role === "admin";
      
      if (!hasAccess) {
        setError("You are not enrolled in this course");
        return;
      }

      setCourse(courseData);
      
      // Load saved progress (in a real app, this would come from the backend)
      const savedProgress = localStorage.getItem(`course_${id}_progress`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCompletedLessons(new Set(progress.completedLessons));
        setCurrentLessonIndex(progress.currentLesson || 0);
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
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < course.content.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setVideoLoading(false);
      setVideoError(false);
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
    <div className={`min-h-screen ${focusMode ? 'bg-black' : 'bg-gray-900'} text-white transition-colors duration-300`}>
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
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-300">{progress}%</span>
              </div>
              
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

      <div className="flex h-screen">
        {/* Sidebar - Course Content */}
        {!focusMode && (
          <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-800 border-r border-gray-700 overflow-hidden`}>
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Course Content</h2>
                <div className="text-sm text-gray-400">
                  {completedLessons.size}/{course.content.length} completed
                </div>
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

          {/* Lesson Content */}
          <div className="flex-1 overflow-y-auto">
            <div className={`${focusMode ? 'max-w-6xl' : 'max-w-4xl'} mx-auto p-6`}>
              {/* Lesson Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className={`${focusMode ? 'text-3xl' : 'text-2xl'} font-bold text-white mb-2`}>
                      {currentLesson.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {currentLesson.duration || "5 min"}
                      </span>
                      <span>Lesson {currentLessonIndex + 1} of {course.content.length}</span>
                    </div>
                  </div>
                  
                  {!focusMode && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className={`px-3 py-2 rounded-md transition-colors ${
                          showTranscript ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 mr-2 inline" />
                        Transcript
                      </button>
                      <button
                        onClick={() => setShowNotes(!showNotes)}
                        className={`px-3 py-2 rounded-md transition-colors ${
                          showNotes ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <FileText className="w-4 h-4 mr-2 inline" />
                        Notes
                      </button>
                      {!completedLessons.has(currentLessonIndex) && (
                        <button
                          onClick={() => markLessonComplete(currentLessonIndex)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2 inline" />
                          Mark Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {!focusMode && (
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {currentLesson.description}
                  </p>
                )}
              </div>

              {/* Video Player */}
              {currentLesson.videoUrl ? (
                <div className="mb-8">
                  <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
                    <div className="relative">
                      <video
                        controls
                        className="w-full aspect-video"
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
                      
                      {/* Video Controls Overlay */}
                      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                        <button
                          onClick={() => setIsFullscreen(!isFullscreen)}
                          className="p-2 bg-black/50 backdrop-blur-sm text-white rounded hover:bg-black/70 transition-colors"
                        >
                          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        </button>
                        <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded px-3 py-2">
                          <Volume2 className="w-4 h-4 text-white" />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                            className="w-16"
                          />
                        </div>
                        <select
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(e.target.value)}
                          className="bg-black/50 backdrop-blur-sm text-white rounded px-2 py-1 text-sm"
                        >
                          <option value="0.5">0.5x</option>
                          <option value="0.75">0.75x</option>
                          <option value="1">1x</option>
                          <option value="1.25">1.25x</option>
                          <option value="1.5">1.5x</option>
                          <option value="2">2x</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="bg-gray-800 rounded-lg p-12 text-center">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Video Available</h3>
                    <p className="text-gray-400">
                      This lesson doesn't have a video component. Please refer to the lesson materials and content below.
                    </p>
                  </div>
                </div>
              )}

              {/* Content Sections */}
              {!focusMode && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Key Concepts */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20">
                      <div className="flex items-center mb-4">
                        <Lightbulb className="w-6 h-6 text-yellow-400 mr-3" />
                        <h3 className="text-xl font-semibold text-white">Key Concepts</h3>
                      </div>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Understanding the fundamentals of this topic</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Practical applications and real-world examples</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Best practices and common pitfalls to avoid</span>
                        </li>
                      </ul>
                    </div>

                    {/* Transcript */}
                    {showTranscript && (
                      <div className="bg-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-white">Transcript</h3>
                        <div className="text-gray-300 leading-relaxed space-y-4 max-h-96 overflow-y-auto">
                          <p>Welcome to this lesson on {currentLesson.title}. In this video, we'll explore the key concepts and practical applications...</p>
                          <p>First, let's understand the fundamental principles that govern this topic. These concepts are essential for building a solid foundation...</p>
                          <p>Now, let's look at some real-world examples to see how these principles apply in practice...</p>
                        </div>
                      </div>
                    )}

                    {/* Lesson Materials */}
                    {currentLesson.materials && currentLesson.materials.length > 0 && (
                      <div className="bg-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-white">Lesson Materials</h3>
                        <div className="space-y-3">
                          {currentLesson.materials.map((material, index) => (
                            <a
                              key={index}
                              href={material}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
                            >
                              <Download className="w-5 h-5 text-blue-400 mr-3 group-hover:text-blue-300" />
                              <div>
                                <div className="font-medium text-white">Resource {index + 1}</div>
                                <div className="text-sm text-gray-400">Click to download</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar Content */}
                  <div className="space-y-6">
                    {/* Notes Section */}
                    {showNotes && (
                      <div className="bg-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-white">My Notes</h3>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Take notes about this lesson..."
                          rows={8}
                          className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={(event) => {
                              localStorage.setItem(`course_${id}_lesson_${currentLessonIndex}_notes`, notes);
                              // Show success message
                              const btn = event.target;
                              const originalText = btn.textContent;
                              btn.textContent = "Saved!";
                              btn.className = btn.className.replace("bg-blue-600 hover:bg-blue-700", "bg-green-600");
                              setTimeout(() => {
                                btn.textContent = originalText;
                                btn.className = btn.className.replace("bg-green-600", "bg-blue-600 hover:bg-blue-700");
                              }, 2000);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save Notes
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Progress Card */}
                    <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-500/20">
                      <h3 className="text-lg font-semibold mb-4 text-white">Your Progress</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-300 mb-2">
                            <span>Course Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300">
                          <p>{completedLessons.size} of {course.content.length} lessons completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className={`${focusMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-gray-800'} border-t border-gray-700 px-6 py-4`}>
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <button
                onClick={goToPreviousLesson}
                disabled={currentLessonIndex === 0}
                className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SkipBack className="w-4 h-4 mr-2" />
                Previous Lesson
              </button>

              <div className="flex items-center space-x-6">
                <div className="text-sm text-gray-400">
                  {currentLessonIndex + 1} / {course.content.length}
                </div>
                <div className="w-64 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentLessonIndex + 1) / course.content.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-400">
                  {Math.round(((currentLessonIndex + 1) / course.content.length) * 100)}%
                </div>
              </div>

              <button
                onClick={goToNextLesson}
                disabled={currentLessonIndex === course.content.length - 1}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next Lesson
                <SkipForward className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearnPage;