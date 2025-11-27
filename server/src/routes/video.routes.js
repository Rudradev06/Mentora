import { Router } from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Store active monitoring sessions
const activeSessions = new Map();

// Start face monitoring for a video session
router.post("/start-monitoring", requireAuth, async (req, res) => {
  try {
    const { courseId, lessonId, userId } = req.body;
    const sessionId = `${userId}_${courseId}_${lessonId}`;

    // Check if already monitoring
    if (activeSessions.has(sessionId)) {
      return res.json({ 
        message: "Monitoring already active",
        sessionId 
      });
    }

    // Path to Python script (using the original p3.py)
    const pythonScript = path.join(process.cwd(), "p3.py");
    
    // Start Python process with custom arguments for video monitoring
    const pythonProcess = spawn("python", [
      pythonScript,
      "--hidden",           // Start hidden (no GUI)
      "--video-mode",       // Special mode for video monitoring
      `--session-id=${sessionId}`,
      `--course-id=${courseId}`,
      `--lesson-id=${lessonId}`
    ], {
      cwd: process.cwd(),
      env: { ...process.env, PYTHONUNBUFFERED: "1" } // Ensure real-time output
    });

    // Store session info
    activeSessions.set(sessionId, {
      process: pythonProcess,
      startTime: new Date(),
      courseId,
      lessonId,
      userId,
      events: []
    });

    // Handle Python process output
    pythonProcess.stdout.on("data", (data) => {
      const output = data.toString();
      console.log(`[Face Monitor ${sessionId}]:`, output);
      
      // Store events
      const session = activeSessions.get(sessionId);
      if (session) {
        session.events.push({
          timestamp: new Date(),
          type: "info",
          message: output
        });
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`[Face Monitor Error ${sessionId}]:`, data.toString());
      
      const session = activeSessions.get(sessionId);
      if (session) {
        session.events.push({
          timestamp: new Date(),
          type: "error",
          message: data.toString()
        });
      }
    });

    pythonProcess.on("close", (code) => {
      console.log(`[Face Monitor ${sessionId}] Process exited with code ${code}`);
      activeSessions.delete(sessionId);
    });

    res.json({
      message: "Face monitoring started",
      sessionId,
      status: "active"
    });

  } catch (err) {
    console.error("Error starting face monitoring:", err);
    res.status(500).json({ message: "Failed to start monitoring" });
  }
});

// Stop face monitoring
router.post("/stop-monitoring", requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!activeSessions.has(sessionId)) {
      return res.status(404).json({ message: "Session not found" });
    }

    const session = activeSessions.get(sessionId);
    
    // Kill the Python process
    session.process.kill();
    
    // Get session summary
    const summary = {
      sessionId,
      duration: new Date() - session.startTime,
      eventsCount: session.events.length,
      events: session.events
    };

    activeSessions.delete(sessionId);

    res.json({
      message: "Monitoring stopped",
      summary
    });

  } catch (err) {
    console.error("Error stopping monitoring:", err);
    res.status(500).json({ message: "Failed to stop monitoring" });
  }
});

// Get monitoring status
router.get("/monitoring-status/:sessionId", requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!activeSessions.has(sessionId)) {
      return res.json({ 
        status: "inactive",
        message: "No active monitoring session" 
      });
    }

    const session = activeSessions.get(sessionId);
    
    res.json({
      status: "active",
      sessionId,
      startTime: session.startTime,
      duration: new Date() - session.startTime,
      eventsCount: session.events.length,
      recentEvents: session.events.slice(-10) // Last 10 events
    });

  } catch (err) {
    console.error("Error getting monitoring status:", err);
    res.status(500).json({ message: "Failed to get status" });
  }
});

// Get all active sessions (admin only)
router.get("/active-sessions", requireAuth, async (req, res) => {
  try {
    const sessions = Array.from(activeSessions.entries()).map(([id, session]) => ({
      sessionId: id,
      userId: session.userId,
      courseId: session.courseId,
      lessonId: session.lessonId,
      startTime: session.startTime,
      duration: new Date() - session.startTime,
      eventsCount: session.events.length
    }));

    res.json({ sessions });

  } catch (err) {
    console.error("Error getting active sessions:", err);
    res.status(500).json({ message: "Failed to get sessions" });
  }
});

export default router;
