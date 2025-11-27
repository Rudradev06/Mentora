#!/usr/bin/env python3
"""
Video Monitoring Script for Mentora Platform
Monitors student attention during video playback
"""

import cv2
import numpy as np
import time
import sys
import json
import argparse
from datetime import datetime

class VideoMonitor:
    def __init__(self, sensitivity=5, check_interval=1.0):
        self.sensitivity = sensitivity
        self.check_interval = check_interval
        self.running = False
        self.last_face_time = time.time()
        self.cap = None
        self.face_cascade = None
        self.events = []
        self.face_detected_count = 0
        self.no_face_count = 0
        self.multiple_faces_count = 0
        
    def log_event(self, event_type, message):
        """Log an event with timestamp"""
        event = {
            "timestamp": datetime.now().isoformat(),
            "type": event_type,
            "message": message
        }
        self.events.append(event)
        print(json.dumps(event), flush=True)
        
    def initialize_camera(self):
        """Initialize webcam"""
        try:
            # Try different backends
            backends = [cv2.CAP_DSHOW, cv2.CAP_ANY]
            for backend in backends:
                self.cap = cv2.VideoCapture(0, backend)
                if self.cap.isOpened():
                    self.log_event("info", "Camera initialized successfully")
                    return True
            
            self.log_event("error", "Could not open webcam")
            return False
        except Exception as e:
            self.log_event("error", f"Camera initialization error: {str(e)}")
            return False
    
    def initialize_face_detector(self):
        """Initialize face detection"""
        try:
            # Use Haar Cascade (lightweight and reliable)
            cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            self.face_cascade = cv2.CascadeClassifier(cascade_path)
            
            if self.face_cascade.empty():
                self.log_event("error", "Failed to load face cascade")
                return False
                
            self.log_event("info", "Face detector initialized")
            return True
        except Exception as e:
            self.log_event("error", f"Face detector initialization error: {str(e)}")
            return False
    
    def detect_faces(self, frame):
        """Detect faces in frame"""
        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30)
            )
            return faces
        except Exception as e:
            self.log_event("error", f"Face detection error: {str(e)}")
            return []
    
    def start_monitoring(self):
        """Start the monitoring loop"""
        self.log_event("info", "Starting video monitoring")
        
        if not self.initialize_camera():
            return False
            
        if not self.initialize_face_detector():
            self.cap.release()
            return False
        
        self.running = True
        self.last_face_time = time.time()
        
        try:
            while self.running:
                ret, frame = self.cap.read()
                if not ret:
                    self.log_event("warning", "Could not read frame")
                    time.sleep(self.check_interval)
                    continue
                
                # Detect faces
                faces = self.detect_faces(frame)
                face_count = len(faces)
                
                # Handle detection results
                if face_count == 1:
                    # Exactly one face - good!
                    self.last_face_time = time.time()
                    self.face_detected_count += 1
                    
                    if self.face_detected_count % 10 == 0:  # Log every 10 detections
                        self.log_event("face_detected", "Student is watching")
                        
                elif face_count > 1:
                    # Multiple faces detected
                    self.multiple_faces_count += 1
                    self.log_event("warning", f"Multiple faces detected ({face_count})")
                    
                else:
                    # No face detected
                    elapsed = time.time() - self.last_face_time
                    self.no_face_count += 1
                    
                    if elapsed >= self.sensitivity:
                        self.log_event("warning", f"No face detected for {int(elapsed)}s")
                        
                        # Suggest pausing video
                        if elapsed >= self.sensitivity * 2:
                            self.log_event("alert", "Student not watching - consider pausing")
                
                time.sleep(self.check_interval)
                
        except KeyboardInterrupt:
            self.log_event("info", "Monitoring stopped by user")
        except Exception as e:
            self.log_event("error", f"Monitoring error: {str(e)}")
        finally:
            self.stop_monitoring()
        
        return True
    
    def stop_monitoring(self):
        """Stop monitoring and cleanup"""
        self.running = False
        
        if self.cap:
            self.cap.release()
        
        # Log summary
        summary = {
            "total_events": len(self.events),
            "face_detected_count": self.face_detected_count,
            "no_face_count": self.no_face_count,
            "multiple_faces_count": self.multiple_faces_count
        }
        
        self.log_event("summary", json.dumps(summary))
        self.log_event("info", "Monitoring stopped")
    
    def get_summary(self):
        """Get monitoring summary"""
        return {
            "events": self.events,
            "face_detected_count": self.face_detected_count,
            "no_face_count": self.no_face_count,
            "multiple_faces_count": self.multiple_faces_count
        }


def main():
    parser = argparse.ArgumentParser(description="Video Monitoring for Mentora")
    parser.add_argument("--sensitivity", type=int, default=5, help="Seconds before warning")
    parser.add_argument("--interval", type=float, default=1.0, help="Check interval in seconds")
    parser.add_argument("--headless", action="store_true", help="Run without GUI")
    
    args = parser.parse_args()
    
    monitor = VideoMonitor(
        sensitivity=args.sensitivity,
        check_interval=args.interval
    )
    
    try:
        monitor.start_monitoring()
    except Exception as e:
        print(json.dumps({
            "timestamp": datetime.now().isoformat(),
            "type": "error",
            "message": f"Fatal error: {str(e)}"
        }), flush=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
