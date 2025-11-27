// Example: How to integrate video monitoring into CourseLearnPage.jsx

import { useState, useEffect, useRef } from "react";
import { videoMonitoringAPI } from "../services/videoMonitoring";

const CourseLearnPage = () => {
  // ... existing state ...
  
  // Add monitoring state
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [monitoringSessionId, setMonitoringSessionId] = useState(null);
  const [monitoringConsent, setMonitoringConsent] = useState(false);
  const videoRef = useRef(null);

  // Start monitoring when video plays
  const handleVideoPlay = async () => {
    if (!monitoringConsent) {
      // Show consent dialog first
      const consent = window.confirm(
        "This course uses attention monitoring to ensure engagement. " +
        "Your webcam will detect your presence but no video is recorded. " +
        "Do you consent to monitoring?"
      );
      
      if (!consent) {
        // Pause video if no consent
        if (videoRef.current) {
          videoRef.current.pause();
        }
        return;
      }
      
      setMonitoringConsent(true);
    }

    try {
      const response = await videoMonitoringAPI.startMonitoring(
        id, // courseId
        currentLessonIndex, // lessonId
        user.id
      );
      
      setMonitoringSessionId(response.data.sessionId);
      setMonitoringActive(true);
      console.log("Monitoring started:", response.data.sessionId);
    } catch (error) {
      console.error("Failed to start monitoring:", error);
      // Continue playing even if monitoring fails
    }
  };

  // Stop monitoring when video pauses or ends
  const handleVideoStop = async () => {
    if (!monitoringSessionId) return;

    try {
      const response = await videoMonitoringAPI.stopMonitoring(monitoringSessionId);
      console.log("Monitoring summary:", response.data.summary);
      
      setMonitoringActive(false);
      setMonitoringSessionId(null);
      
      // Optionally show summary to user
      const summary = response.data.summary;
      console.log(`Session duration: ${summary.duration}ms`);
      console.log(`Events logged: ${summary.eventsCount}`);
    } catch (error) {
      console.error("Failed to stop monitoring:", error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (monitoringSessionId) {
        handleVideoStop();
      }
    };
  }, [monitoringSessionId]);

  return (
    <div className="course-learn-page">
      {/* Monitoring Status Indicator */}
      {monitoringActive && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Attention Monitoring Active</span>
          </div>
        </div>
      )}

      {/* Video Player */}
      <div className="video-container">
        <video
          ref={videoRef}
          controls
          className="w-full aspect-video"
          src={currentLesson.videoUrl}
          onPlay={handleVideoPlay}
          onPause={handleVideoStop}
          onEnded={handleVideoStop}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Monitoring Consent Notice (show once) */}
      {!monitoringConsent && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                Attention Monitoring Notice
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This course uses webcam-based attention monitoring to ensure engagement.
                  When you play a video:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your webcam will detect your presence</li>
                  <li>No video or images are recorded or stored</li>
                  <li>Only attention events are logged</li>
                  <li>You'll be notified if you look away</li>
                </ul>
                <p className="mt-2">
                  You'll be asked for consent when you start the video.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your CourseLearnPage content */}
    </div>
  );
};

export default CourseLearnPage;
