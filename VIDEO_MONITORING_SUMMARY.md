# 📹 Video Monitoring - Quick Summary

## ✅ What Was Added

I've integrated your `p3.py` face monitoring script into the Mentora platform to track student attention during video playback.

---

## 🎯 How It Works

```
Student Plays Video → Python Script Starts → Webcam Monitors Face → Logs Events → Generates Report
```

---

## 📁 Files Created

### Backend:
1. **`server/src/routes/video.routes.js`** - API endpoints for monitoring
2. **`server/src/scripts/video_monitor.py`** - Headless monitoring script

### Frontend:
3. **`client/src/services/videoMonitoring.js`** - API service

### Documentation:
4. **`VIDEO_MONITORING_SETUP.md`** - Complete setup guide
5. **`VIDEO_MONITORING_SUMMARY.md`** - This file

---

## 🚀 Quick Start

### 1. Install Python Dependencies:

```bash
pip install opencv-python numpy
```

### 2. Test the Script:

```bash
python server/src/scripts/video_monitor.py --headless
```

### 3. Restart Server:

```bash
.\start.bat
```

---

## 🔌 API Endpoints Added

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/video/start-monitoring` | Start face monitoring |
| POST | `/api/video/stop-monitoring` | Stop monitoring |
| GET | `/api/video/monitoring-status/:id` | Get status |
| GET | `/api/video/active-sessions` | List all sessions |

---

## 💻 Usage Example

```javascript
import { videoMonitoringAPI } from "../services/videoMonitoring";

// When video starts playing
const startMonitoring = async () => {
  const response = await videoMonitoringAPI.startMonitoring(
    courseId,
    lessonId,
    user.id
  );
  console.log("Monitoring started:", response.data.sessionId);
};

// When video ends
const stopMonitoring = async (sessionId) => {
  const response = await videoMonitoringAPI.stopMonitoring(sessionId);
  console.log("Summary:", response.data.summary);
};
```

---

## 🎨 What It Monitors

- ✅ **Face Detected** - Student is watching
- ⚠️ **No Face** - Student looked away
- ⚠️ **Multiple Faces** - Potential cheating
- 📊 **Events Logged** - Complete attention history

---

## 📊 Event Types

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "type": "face_detected",
  "message": "Student is watching"
}
```

Types: `info`, `face_detected`, `warning`, `alert`, `error`, `summary`

---

## 🔧 Configuration

Edit `server/src/routes/video.routes.js`:

```javascript
spawn("python", [
  pythonScript,
  "--headless",           // No GUI
  "--sensitivity", "5",   // Warning after 5s
  "--interval", "1.0"     // Check every 1s
]);
```

---

## 🎯 Next Steps

### To Fully Integrate:

1. **Update CourseLearnPage.jsx:**
   - Import `videoMonitoringAPI`
   - Call `startMonitoring()` on video play
   - Call `stopMonitoring()` on video end
   - Show monitoring status indicator

2. **Add UI Indicator:**
   ```jsx
   <div className="monitoring-active">
     🔴 Attention Monitoring Active
   </div>
   ```

3. **Add Analytics Dashboard:**
   - Show attention rates
   - Display engagement metrics
   - Generate reports

---

## 📝 Original Script

Your original `p3.py` script is still available at the root directory with full GUI features:
- System tray integration
- Lock screen functionality
- Notifications
- Settings panel

The new `video_monitor.py` is a simplified, headless version optimized for web integration.

---

## 🔒 Privacy Notice

**Important:** Always inform students that monitoring is active!

Recommended notice:
```
📹 This course uses attention monitoring to ensure engagement.
Your webcam detects your presence but no video is recorded.
```

---

## 🐛 Troubleshooting

### Camera not working?
```bash
python -c "import cv2; print('OK' if cv2.VideoCapture(0).isOpened() else 'Error')"
```

### Python not found?
Update spawn command to use `python3` instead of `python`

### Face detection issues?
```bash
pip install --upgrade opencv-python
```

---

## 🎉 You're All Set!

Your video monitoring system is ready. Just:
1. ✅ Install Python dependencies
2. ✅ Test the script
3. ✅ Integrate into CourseLearnPage
4. ✅ Start monitoring student attention!

**See `VIDEO_MONITORING_SETUP.md` for detailed integration guide.**
