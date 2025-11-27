# 📹 Video Monitoring Integration Guide

## Overview

Your Mentora platform now includes **face detection monitoring** that tracks student attention during video playback. This ensures students are actively watching course content.

---

## 🎯 Features

### What It Does:
- ✅ Detects if student is watching the video
- ✅ Alerts when student looks away
- ✅ Detects multiple faces (potential cheating)
- ✅ Logs all monitoring events
- ✅ Can pause video if student not watching
- ✅ Generates attention reports

### How It Works:
1. Student starts watching a video lesson
2. Python script activates webcam
3. Face detection monitors student presence
4. Events are logged in real-time
5. Alerts sent if student not watching
6. Summary generated when video ends

---

## 📦 Requirements

### Python Dependencies:

```bash
pip install opencv-python numpy
```

### System Requirements:
- Python 3.7+
- Webcam access
- Windows/Mac/Linux

---

## 🚀 Quick Start

### 1. Install Python Dependencies

```bash
cd server
pip install opencv-python numpy
```

### 2. Test the Monitoring Script

```bash
# Test the simplified monitoring script
python src/scripts/video_monitor.py --headless

# Test with custom settings
python src/scripts/video_monitor.py --sensitivity 10 --interval 0.5
```

### 3. Restart Your Server

The video monitoring routes are already integrated. Just restart:

```bash
.\start.bat
```

---

## 🔌 API Endpoints

### Start Monitoring
```
POST /api/video/start-monitoring
```

**Request:**
```json
{
  "courseId": "course_id_here",
  "lessonId": "lesson_id_here",
  "userId": "user_id_here"
}
```

**Response:**
```json
{
  "message": "Face monitoring started",
  "sessionId": "user_course_lesson",
  "status": "active"
}
```

### Stop Monitoring
```
POST /api/video/stop-monitoring
```

**Request:**
```json
{
  "sessionId": "user_course_lesson"
}
```

**Response:**
```json
{
  "message": "Monitoring stopped",
  "summary": {
    "sessionId": "user_course_lesson",
    "duration": 120000,
    "eventsCount": 45,
    "events": [...]
  }
}
```

### Get Monitoring Status
```
GET /api/video/monitoring-status/:sessionId
```

**Response:**
```json
{
  "status": "active",
  "sessionId": "user_course_lesson",
  "startTime": "2024-01-15T10:30:00Z",
  "duration": 60000,
  "eventsCount": 20,
  "recentEvents": [...]
}
```

---

## 💻 Frontend Integration

### Using the Video Monitoring Service

```javascript
import { videoMonitoringAPI } from "../services/videoMonitoring";

// Start monitoring when video plays
const handleVideoPlay = async () => {
  try {
    const response = await videoMonitoringAPI.startMonitoring(
      courseId,
      lessonId,
      user.id
    );
    setMonitoringSessionId(response.data.sessionId);
  } catch (error) {
    console.error("Failed to start monitoring:", error);
  }
};

// Stop monitoring when video ends
const handleVideoEnd = async () => {
  try {
    const response = await videoMonitoringAPI.stopMonitoring(
      monitoringSessionId
    );
    console.log("Monitoring summary:", response.data.summary);
  } catch (error) {
    console.error("Failed to stop monitoring:", error);
  }
};
```

---

## 📊 Event Types

The monitoring system logs these events:

| Event Type | Description |
|------------|-------------|
| `info` | General information |
| `face_detected` | Student is watching |
| `warning` | No face or multiple faces |
| `alert` | Student not watching for extended period |
| `error` | System error |
| `summary` | Session summary |

---

## ⚙️ Configuration

### Monitoring Settings:

```javascript
{
  sensitivity: 5,        // Seconds before warning
  check_interval: 1.0,   // How often to check (seconds)
  headless: true         // Run without GUI
}
```

### Customize in Backend:

Edit `server/src/routes/video.routes.js`:

```javascript
const pythonProcess = spawn("python", [
  pythonScript,
  "--headless",
  "--sensitivity", "10",    // Custom sensitivity
  "--interval", "0.5"       // Custom interval
]);
```

---

## 🎨 UI Integration Example

Add monitoring indicator to your video player:

```jsx
const [isMonitoring, setIsMonitoring] = useState(false);
const [monitoringStatus, setMonitoringStatus] = useState("inactive");

// Show monitoring status
{isMonitoring && (
  <div className="monitoring-indicator">
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm text-gray-600">
        Attention Monitoring Active
      </span>
    </div>
  </div>
)}
```

---

## 📈 Analytics & Reports

### Get Student Attention Report:

```javascript
const getAttentionReport = async (sessionId) => {
  const response = await videoMonitoringAPI.getMonitoringStatus(sessionId);
  
  const summary = {
    totalDuration: response.data.duration,
    attentionRate: calculateAttentionRate(response.data.events),
    warnings: response.data.events.filter(e => e.type === "warning").length,
    alerts: response.data.events.filter(e => e.type === "alert").length
  };
  
  return summary;
};
```

---

## 🔒 Privacy & Security

### Important Considerations:

1. **Inform Students**: Always notify students that monitoring is active
2. **Consent**: Get explicit consent before enabling monitoring
3. **Data Storage**: Events are stored temporarily, not video footage
4. **Transparency**: Show monitoring status clearly in UI
5. **Opt-Out**: Consider allowing students to opt-out with instructor approval

### Recommended UI Notice:

```jsx
<div className="monitoring-notice">
  <p>
    📹 This course uses attention monitoring to ensure engagement.
    Your webcam will be used to detect your presence, but no video
    is recorded or stored.
  </p>
  <button onClick={acceptMonitoring}>I Understand</button>
</div>
```

---

## 🐛 Troubleshooting

### Camera Not Working?

```bash
# Test camera access
python -c "import cv2; cap = cv2.VideoCapture(0); print('Camera OK' if cap.isOpened() else 'Camera Error')"
```

### Python Not Found?

Make sure Python is in your PATH:

```bash
# Windows
where python

# Mac/Linux
which python3
```

Update the spawn command in `video.routes.js` if needed:

```javascript
const pythonProcess = spawn("python3", [pythonScript, "--headless"]);
```

### Face Detection Not Working?

The script uses OpenCV's Haar Cascade which is included with opencv-python. If issues persist:

```bash
pip install --upgrade opencv-python
```

---

## 📝 Files Added

### Backend:
- `server/src/routes/video.routes.js` - Video monitoring API
- `server/src/scripts/video_monitor.py` - Simplified monitoring script

### Frontend:
- `client/src/services/videoMonitoring.js` - API service

### Original Script:
- `p3.py` - Full-featured monitoring app (GUI version)

---

## 🎯 Next Steps

### 1. Test the Integration

```bash
# Start your servers
.\start.bat

# In another terminal, test the monitoring
curl -X POST http://localhost:5000/api/video/start-monitoring \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"courseId":"test","lessonId":"test","userId":"test"}'
```

### 2. Add UI Components

Update `CourseLearnPage.jsx` to:
- Start monitoring on video play
- Stop monitoring on video end
- Show monitoring status
- Display attention alerts

### 3. Add Analytics

Create a dashboard showing:
- Student attention rates
- Average watch time
- Distraction patterns
- Course engagement metrics

---

## 🎉 Benefits

### For Teachers:
- ✅ Verify student engagement
- ✅ Identify struggling students
- ✅ Improve course content
- ✅ Track completion authenticity

### For Students:
- ✅ Stay focused during lessons
- ✅ Better learning outcomes
- ✅ Accountability
- ✅ Progress tracking

### For Platform:
- ✅ Quality assurance
- ✅ Certification validity
- ✅ Competitive advantage
- ✅ Data-driven insights

---

## 📚 Additional Resources

- OpenCV Documentation: https://docs.opencv.org/
- Face Detection Guide: https://opencv-python-tutroals.readthedocs.io/
- Privacy Best Practices: https://www.privacypolicies.com/

---

**Your video monitoring system is ready to use!** 🚀

Just install the Python dependencies and the system will automatically monitor student attention during video playback.
