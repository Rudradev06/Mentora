import api from "./api";

export const videoMonitoringAPI = {
  startMonitoring: (courseId, lessonId, userId) => 
    api.post("/video/start-monitoring", { courseId, lessonId, userId }),
  
  stopMonitoring: (sessionId) => 
    api.post("/video/stop-monitoring", { sessionId }),
  
  getMonitoringStatus: (sessionId) => 
    api.get(`/video/monitoring-status/${sessionId}`),
  
  getActiveSessions: () => 
    api.get("/video/active-sessions"),
};
