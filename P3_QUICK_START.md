# 🚀 P3.py Quick Start

## ⚡ TL;DR

Your `p3.py` face monitoring script is now integrated! Here's how to use it:

---

## 📦 Install (1 minute)

```bash
install_monitoring.bat
```

Or manually:
```bash
pip install opencv-python numpy plyer pystray pillow
```

---

## 🧪 Test (30 seconds)

```bash
# Test video mode
python p3.py --video-mode --session-id=test

# Test standalone mode
python p3.py
```

---

## 🎯 Use It

### **For Personal Use:**
```bash
python p3.py
```
Full GUI with all features!

### **For Video Monitoring:**
Just restart your server - it's automatic!
```bash
.\start.bat
```

---

## 🎨 Two Modes

| Feature | Standalone | Video Mode |
|---------|-----------|------------|
| GUI | ✅ | ❌ |
| Lock Screen | ✅ | ❌ |
| Notifications | ✅ | ✅ |
| JSON Events | ❌ | ✅ |
| Platform Integration | ❌ | ✅ |

---

## 📊 What It Does

When a student watches a video:
1. ✅ Detects if they're watching
2. ⚠️ Warns if they look away
3. 🚨 Alerts if timeout reached
4. 📈 Logs all events
5. 📊 Generates summary

---

## 🔌 API Endpoints

```javascript
POST /api/video/start-monitoring  // Start
POST /api/video/stop-monitoring   // Stop
GET  /api/video/monitoring-status/:id  // Status
```

---

## 💻 Frontend Usage

```javascript
import { videoMonitoringAPI } from "../services/videoMonitoring";

// Start
await videoMonitoringAPI.startMonitoring(courseId, lessonId, userId);

// Stop
await videoMonitoringAPI.stopMonitoring(sessionId);
```

---

## 📝 Events

```json
{"type": "face_detected", "message": "Student is watching"}
{"type": "warning", "message": "No face detected for 5s"}
{"type": "alert", "message": "Student not watching"}
{"type": "warning", "face_count": 3, "message": "Multiple faces"}
```

---

## 🎯 Next Steps

1. ✅ Install dependencies: `install_monitoring.bat`
2. ✅ Test script: `python p3.py --video-mode --session-id=test`
3. ✅ Restart server: `.\start.bat`
4. ✅ Watch a video - monitoring starts automatically!

---

## 📚 Full Docs

- **Complete Guide:** `P3_INTEGRATION_GUIDE.md`
- **Summary:** `P3_INTEGRATION_SUMMARY.md`
- **Setup:** `VIDEO_MONITORING_SETUP.md`

---

**That's it! Your monitoring system is ready!** 🎉
