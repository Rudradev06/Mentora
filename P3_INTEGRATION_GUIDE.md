# 🎯 P3.py Integration Guide

## Overview

Your original `p3.py` face monitoring script is now fully integrated into the Mentora platform! It runs in a special **video monitoring mode** when students watch course videos.

---

## 🎨 Features Preserved

All the powerful features from your original `p3.py` are available:

### ✅ **Face Detection:**
- DNN-based face detection (high accuracy)
- Haar Cascade fallback (lightweight)
- Real-time monitoring
- Multiple face detection

### ✅ **Smart Monitoring:**
- Configurable sensitivity
- Timeout warnings
- Multiple faces alert
- Event logging

### ✅ **Notifications:**
- Desktop notifications
- Sound alerts (Windows)
- System tray integration
- Visual indicators

### ✅ **Settings:**
- Adjustable sensitivity
- Custom timeout
- Preview size control
- Check interval
- Auto-start option

---

## 🔄 Two Modes of Operation

### 1. **Standalone Mode** (Original)
Run with full GUI for personal use:

```bash
python p3.py
```

Features:
- Full GUI interface
- Settings panel
- System tray
- Screen locking
- Auto-start

### 2. **Video Monitoring Mode** (New)
Runs headlessly for course video monitoring:

```bash
python p3.py --video-mode --session-id=abc123 --course-id=course1 --lesson-id=lesson1
```

Features:
- No GUI (headless)
- JSON event output
- Real-time status
- No screen locking
- Integrated with platform

---

## 📦 Dependencies

Install all required packages:

```bash
pip install opencv-python numpy tkinter plyer pystray pillow
```

### Required Packages:
- `opencv-python` - Face detection
- `numpy` - Image processing
- `tkinter` - GUI (built-in with Python)
- `plyer` - Cross-platform notifications
- `pystray` - System tray integration
- `pillow` - Image handling

---

## 🚀 How It Works

### When a Student Plays a Video:

```
1. Student clicks play on video
   ↓
2. Backend calls: POST /api/video/start-monitoring
   ↓
3. Server spawns: python p3.py --video-mode --session-id=...
   ↓
4. p3.py activates webcam
   ↓
5. Face detection monitors student
   ↓
6. Events output as JSON to stdout
   ↓
7. Backend captures and logs events
   ↓
8. Student stops video
   ↓
9. Backend calls: POST /api/video/stop-monitoring
   ↓
10. p3.py process terminates
    ↓
11. Summary generated
```

---

## 📊 Event Types

The script outputs JSON events:

### **Face Detected:**
```json
{
  "timestamp": "2024-01-15 10:30:00",
  "type": "face_detected",
  "face_count": 1,
  "message": "Student is watching"
}
```

### **Warning (No Face):**
```json
{
  "timestamp": "2024-01-15 10:30:05",
  "type": "warning",
  "face_count": 0,
  "elapsed": 5,
  "message": "No face detected for 5s"
}
```

### **Alert (Timeout):**
```json
{
  "timestamp": "2024-01-15 10:30:10",
  "type": "alert",
  "face_count": 0,
  "elapsed": 10,
  "message": "Student not watching - timeout reached"
}
```

### **Multiple Faces:**
```json
{
  "timestamp": "2024-01-15 10:30:15",
  "type": "warning",
  "face_count": 3,
  "message": "Multiple faces detected (3)"
}
```

### **Status Update:**
```json
{
  "session_id": "user_course_lesson",
  "timestamp": "2024-01-15 10:30:20",
  "type": "status",
  "face_count": 1,
  "monitoring": true
}
```

---

## ⚙️ Configuration

### Command Line Arguments:

```bash
python p3.py --video-mode \
  --session-id=abc123 \
  --course-id=course1 \
  --lesson-id=lesson1 \
  --sensitivity=5 \
  --timeout=10 \
  --check-interval=1.0
```

| Argument | Default | Description |
|----------|---------|-------------|
| `--video-mode` | - | Enable video monitoring mode |
| `--session-id` | - | Unique session identifier |
| `--course-id` | - | Course ID |
| `--lesson-id` | - | Lesson ID |
| `--sensitivity` | 5 | Seconds before warning |
| `--timeout` | 10 | Seconds before alert |
| `--check-interval` | 1.0 | Check frequency (seconds) |

---

## 🔧 Backend Integration

The backend automatically handles everything:

```javascript
// server/src/routes/video.routes.js

const pythonProcess = spawn("python", [
  "p3.py",
  "--video-mode",
  `--session-id=${sessionId}`,
  `--course-id=${courseId}`,
  `--lesson-id=${lessonId}`
], {
  cwd: process.cwd(),
  env: { ...process.env, PYTHONUNBUFFERED: "1" }
});

// Capture JSON events
pythonProcess.stdout.on("data", (data) => {
  const output = data.toString();
  console.log(`[Face Monitor]:`, output);
  
  // Parse and store events
  try {
    const event = JSON.parse(output);
    session.events.push(event);
  } catch (e) {
    // Non-JSON output (logs, etc.)
  }
});
```

---

## 💻 Frontend Integration

Use the video monitoring API:

```javascript
import { videoMonitoringAPI } from "../services/videoMonitoring";

// Start monitoring
const handleVideoPlay = async () => {
  const response = await videoMonitoringAPI.startMonitoring(
    courseId,
    lessonId,
    user.id
  );
  setMonitoringSessionId(response.data.sessionId);
};

// Stop monitoring
const handleVideoStop = async () => {
  const response = await videoMonitoringAPI.stopMonitoring(
    monitoringSessionId
  );
  console.log("Summary:", response.data.summary);
};
```

---

## 🎨 Key Differences: Video Mode vs Standalone

| Feature | Standalone Mode | Video Mode |
|---------|----------------|------------|
| GUI | ✅ Full interface | ❌ Headless |
| Screen Lock | ✅ Locks on timeout | ❌ No locking |
| Notifications | ✅ Desktop alerts | ✅ Desktop alerts |
| System Tray | ✅ Minimize to tray | ❌ No tray |
| Event Output | 📝 GUI logs | 📊 JSON stdout |
| Settings Panel | ✅ Full settings | ⚙️ CLI args |
| Auto-start | ✅ System startup | ❌ On-demand |
| Preview Window | ✅ Video preview | ✅ Video preview |

---

## 🔍 Monitoring Behavior

### In Video Mode:

1. **One Face Detected:**
   - ✅ Student is watching
   - ✅ Logs "face_detected" event
   - ✅ Resets timeout timer

2. **No Face Detected:**
   - ⚠️ Warning after `sensitivity` seconds
   - ⚠️ Alert after `timeout` seconds
   - ❌ **Does NOT lock screen** (video mode)
   - 📊 Logs warning/alert events

3. **Multiple Faces:**
   - ⚠️ Warning notification
   - 📊 Logs warning event
   - 🚨 Potential cheating indicator

---

## 📈 Analytics & Reports

### Session Summary:

```javascript
{
  "sessionId": "user_course_lesson",
  "duration": 120000,  // milliseconds
  "eventsCount": 45,
  "events": [
    { "type": "face_detected", ... },
    { "type": "warning", ... },
    { "type": "alert", ... }
  ]
}
```

### Calculate Attention Rate:

```javascript
const calculateAttentionRate = (events) => {
  const faceDetected = events.filter(e => e.type === "face_detected").length;
  const total = events.length;
  return (faceDetected / total) * 100;
};
```

---

## 🐛 Troubleshooting

### Script Not Starting?

```bash
# Test manually
python p3.py --video-mode --session-id=test

# Check dependencies
pip list | grep opencv
pip list | grep numpy
```

### No Face Detection?

```bash
# Test camera
python -c "import cv2; cap = cv2.VideoCapture(0); print('OK' if cap.isOpened() else 'Error')"

# Check model files
ls res10_300x300_ssd_iter_140000.caffemodel
ls deploy.prototxt
```

### JSON Output Issues?

Make sure `PYTHONUNBUFFERED=1` is set in the environment to get real-time output.

---

## 🔒 Privacy & Ethics

### Important Considerations:

1. **Informed Consent:**
   - Always notify students before monitoring
   - Get explicit consent
   - Explain what data is collected

2. **Data Handling:**
   - Only events are logged (no video/images)
   - Events stored temporarily
   - Clear data retention policy

3. **Transparency:**
   - Show monitoring status clearly
   - Allow students to see their data
   - Provide opt-out options

4. **Security:**
   - Secure event storage
   - Encrypted transmission
   - Access control

### Recommended Notice:

```
📹 Attention Monitoring Active

This course uses webcam-based monitoring to verify engagement.
- Your webcam detects your presence
- No video or images are recorded
- Only attention events are logged
- Data is used for course completion verification

By continuing, you consent to monitoring.
```

---

## 🎯 Advanced Features

### Custom Event Handlers:

Modify `p3.py` to add custom logic:

```python
# In video_monitoring_mode()
if self.face_count == 0 and elapsed > self.timeout:
    # Custom action
    event = {
        "type": "custom_action",
        "action": "pause_video",
        "reason": "student_not_watching"
    }
    print(json.dumps(event), flush=True)
```

### Integration with LMS:

```javascript
// Listen for specific events
pythonProcess.stdout.on("data", (data) => {
  const event = JSON.parse(data.toString());
  
  if (event.type === "alert") {
    // Pause video
    io.emit("pause_video", { sessionId });
  }
  
  if (event.type === "warning" && event.face_count > 1) {
    // Flag for review
    flagForReview(sessionId, "multiple_faces");
  }
});
```

---

## 📚 Additional Resources

- **OpenCV Docs:** https://docs.opencv.org/
- **Face Detection:** https://opencv-python-tutroals.readthedocs.io/
- **Privacy Guidelines:** https://www.privacypolicies.com/

---

## 🎉 Summary

Your `p3.py` script is now:
- ✅ Fully integrated with Mentora platform
- ✅ Works in both standalone and video modes
- ✅ Outputs structured JSON events
- ✅ Preserves all original features
- ✅ Production-ready

**Just install dependencies and it works!** 🚀

```bash
pip install opencv-python numpy tkinter plyer pystray pillow
```

Then restart your server and the monitoring will automatically activate when students play videos!
