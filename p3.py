import cv2
import numpy as np
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import threading
import time
import os
import json
from plyer import notification
import platform
import subprocess
import winsound
from pystray import Icon, MenuItem as item
from PIL import Image, ImageDraw
import sys
import webbrowser


# -------------------- Lock Screen --------------------
def lock_screen():
    try:
        system = platform.system()
        if system == "Windows":
            subprocess.run(["rundll32.exe", "user32.dll,LockWorkStation"])
        elif system == "Darwin":  # macOS
            subprocess.run([
                '/System/Library/CoreServices/Menu Extras/User.menu/Contents/Resources/CGSession',
                '-suspend'
            ])
        elif system == "Linux":
            try:
                subprocess.run(["gnome-screensaver-command", "-l"])
            except:
                subprocess.run(["xdg-screensaver", "lock"])
        else:
            log_event("Lock not supported on this OS")
    except Exception as e:
        log_event(f"Lock screen error: {e}")


# -------------------- Notifications --------------------
def notify_user(title, message, duration=3):
    try:
        notification.notify(
            title=title, 
            message=message, 
            timeout=duration,
            app_name="Face Monitor"
        )
        if platform.system() == "Windows":
            winsound.MessageBeep(winsound.MB_ICONEXCLAMATION)
    except Exception as e:
        print(f"Notification error: {e}")


# -------------------- Settings --------------------
def save_settings(settings):
    try:
        with open("settings.json", "w") as f:
            json.dump(settings, f, indent=4)
    except Exception as e:
        log_event(f"Error saving settings: {e}")


def load_settings():
    default_settings = {
        "sensitivity": 5,
        "timeout": 10,
        "preview_size": 300,
        "autostart": False,
        "enable_sound": True,
        "enable_notifications": True,
        "check_interval": 1.0,
        "show_logs": True  # New setting to control log visibility
    }
    
    try:
        if os.path.exists("settings.json"):
            with open("settings.json", "r") as f:
                loaded_settings = json.load(f)
                # Merge with default settings to ensure all keys exist
                for key in default_settings:
                    if key not in loaded_settings:
                        loaded_settings[key] = default_settings[key]
                return loaded_settings
    except Exception as e:
        log_event(f"Error loading settings: {e}")
    
    return default_settings


# -------------------- Logging --------------------
def log_event(msg):
    try:
        if 'log_text' in globals():
            log_text.config(state=tk.NORMAL)
            log_text.insert(tk.END, time.strftime("%Y-%m-%d %H:%M:%S") + " - " + msg + "\n")
            log_text.yview(tk.END)
            log_text.config(state=tk.DISABLED)
        else:
            print(time.strftime("%Y-%m-%d %H:%M:%S") + " - " + msg)
    except Exception as e:
        print(f"Log error: {e}")


# -------------------- Auto-start --------------------
def enable_autostart(app_name="FaceMonitor"):
    try:
        system = platform.system()
        if system == "Windows":
            startup = os.path.join(os.getenv('APPDATA'), "Microsoft\\Windows\\Start Menu\\Programs\\Startup")
            shortcut = os.path.join(startup, f"{app_name}.bat")
            with open(shortcut, "w") as f:
                f.write(f'@echo off\npythonw "{os.path.abspath(sys.argv[0])}" --hidden\n')
            log_event("Autostart enabled on Windows.")
        elif system == "Darwin":
            # Create a plist for macOS
            plist_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.{app_name.lower()}</string>
    <key>ProgramArguments</key>
    <array>
        <string>python3</string>
        <string>{os.path.abspath(sys.argv[0])}</string>
        <string>--hidden</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>'''
            
            plist_path = os.path.expanduser(f"~/Library/LaunchAgents/com.{app_name.lower()}.plist")
            with open(plist_path, "w") as f:
                f.write(plist_content)
            log_event("Autostart plist created for macOS. You may need to enable it manually.")
        elif system == "Linux":
            # Create a .desktop file for Linux
            desktop_content = f'''[Desktop Entry]
Type=Application
Name={app_name}
Exec=python3 {os.path.abspath(sys.argv[0])} --hidden
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
'''
            autostart_dir = os.path.expanduser("~/.config/autostart")
            os.makedirs(autostart_dir, exist_ok=True)
            desktop_path = os.path.join(autostart_dir, f"{app_name}.desktop")
            with open(desktop_path, "w") as f:
                f.write(desktop_content)
            log_event("Autostart enabled on Linux.")
    except Exception as e:
        log_event(f"Error enabling autostart: {e}")


def disable_autostart(app_name="FaceMonitor"):
    try:
        system = platform.system()
        if system == "Windows":
            startup = os.path.join(os.getenv('APPDATA'), "Microsoft\\Windows\\Start Menu\\Programs\\Startup")
            shortcut = os.path.join(startup, f"{app_name}.bat")
            if os.path.exists(shortcut):
                os.remove(shortcut)
                log_event("Autostart disabled.")
        elif system == "Darwin":
            plist_path = os.path.expanduser(f"~/Library/LaunchAgents/com.{app_name.lower()}.plist")
            if os.path.exists(plist_path):
                os.remove(plist_path)
                log_event("Autostart disabled for macOS.")
        elif system == "Linux":
            desktop_path = os.path.expanduser(f"~/.config/autostart/{app_name}.desktop")
            if os.path.exists(desktop_path):
                os.remove(desktop_path)
                log_event("Autostart disabled for Linux.")
    except Exception as e:
        log_event(f"Error disabling autostart: {e}")


# -------------------- Monitor Thread --------------------
class MonitorThread(threading.Thread):
    def __init__(self, sensitivity, timeout, preview_size, check_interval, enable_notifications, enable_sound):
        super().__init__()
        self.sensitivity = sensitivity
        self.timeout = timeout
        self.preview_size = preview_size
        self.check_interval = check_interval
        self.enable_notifications = enable_notifications
        self.enable_sound = enable_sound
        self.running = False
        self.last_face_time = time.time()
        self.cap = None
        self.net = None
        self.warning_shown = False
        self.multiple_faces_warning_shown = False
        self.face_count = 0
        self.daemon = True

    def run(self):
        self.running = True
        
        # Try different backends to open camera
        backends = [cv2.CAP_DSHOW, cv2.CAP_ANY]
        for backend in backends:
            self.cap = cv2.VideoCapture(0, backend)
            if self.cap.isOpened():
                break
        
        if not self.cap.isOpened():
            log_event("Error: Could not open webcam")
            if self.enable_notifications:
                notify_user("Face Monitor Error", "Could not access webcam. Please check your camera settings.")
            return

        # Load DNN face detector
        modelFile = "res10_300x300_ssd_iter_140000.caffemodel"
        configFile = "deploy.prototxt"
        
        # Check if model files exist, if not, download them or use Haar Cascade
        if not (os.path.exists(modelFile) and os.path.exists(configFile)):
            log_event("Model files missing! Downloading...")
            self.download_model_files()
            
        if os.path.exists(modelFile) and os.path.exists(configFile):
            try:
                self.net = cv2.dnn.readNetFromCaffe(configFile, modelFile)
                log_event("DNN face detector loaded.")
            except Exception as e:
                log_event(f"Error loading DNN: {e}. Falling back to Haar Cascade.")
                self.net = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        else:
            log_event("Model files not available. Falling back to Haar Cascade.")
            self.net = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

        while self.running:
            ret, frame = self.cap.read()
            if not ret:
                log_event("Error: Could not read frame from webcam")
                time.sleep(self.check_interval)
                continue

            frame_resized = cv2.resize(frame, (self.preview_size, self.preview_size))

            # Detect faces
            faces = []
            if isinstance(self.net, cv2.CascadeClassifier):
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = self.net.detectMultiScale(gray, 1.3, 5)
            else:
                try:
                    (h, w) = frame.shape[:2]
                    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
                                                 (300, 300), (104.0, 177.0, 123.0))
                    self.net.setInput(blob)
                    detections = self.net.forward()
                    for i in range(0, detections.shape[2]):
                        confidence = detections[0, 0, i, 2]
                        if confidence > 0.5:
                            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                            (x, y, x2, y2) = box.astype("int")
                            # Ensure coordinates are within frame boundaries
                            x, y = max(0, x), max(0, y)
                            x2, y2 = min(w, x2), min(h, y2)
                            faces.append((x, y, x2 - x, y2 - y))
                except Exception as e:
                    log_event(f"Error in DNN detection: {e}")

            # Draw rectangles around detected faces
            for (x, y, w, h) in faces:
                cv2.rectangle(frame_resized, (int(x * self.preview_size / frame.shape[1]), 
                                             int(y * self.preview_size / frame.shape[0])),
                                             (int((x + w) * self.preview_size / frame.shape[1]), 
                                             int((y + h) * self.preview_size / frame.shape[0])), 
                                             (0, 255, 0), 2)

            # Handle detection logic
            self.face_count = len(faces)
            
            if self.face_count == 1:  # Exactly one face detected
                self.last_face_time = time.time()
                self.warning_shown = False
                self.multiple_faces_warning_shown = False
                
                # Output JSON event for video mode
                if '--video-mode' in sys.argv:
                    event = {
                        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                        "type": "face_detected",
                        "face_count": 1,
                        "message": "Student is watching"
                    }
                    print(json.dumps(event), flush=True)
                
                if 'status_label' in globals():
                    status_label.config(text="Status: One face detected", foreground="green")
                
            elif self.face_count > 1:  # More than one face detected
                if not self.multiple_faces_warning_shown:
                    # Output JSON event
                    if '--video-mode' in sys.argv:
                        event = {
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                            "type": "warning",
                            "face_count": self.face_count,
                            "message": f"Multiple faces detected ({self.face_count})"
                        }
                        print(json.dumps(event), flush=True)
                    
                    if self.enable_notifications:
                        notify_user("Warning", "Multiple faces detected! Only one person should be in front of the camera.")
                    self.multiple_faces_warning_shown = True
                    
                if 'status_label' in globals():
                    status_label.config(text="Status: Warning - Multiple faces detected", foreground="orange")
                    
            else:  # No faces detected
                elapsed = time.time() - self.last_face_time
                
                if elapsed >= self.timeout - self.sensitivity and not self.warning_shown:
                    # Output JSON event
                    if '--video-mode' in sys.argv:
                        event = {
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                            "type": "warning",
                            "face_count": 0,
                            "elapsed": int(elapsed),
                            "message": f"No face detected for {int(elapsed)}s"
                        }
                        print(json.dumps(event), flush=True)
                    
                    if self.enable_notifications:
                        notify_user("Warning", "No face detected. Locking soon...")
                    self.warning_shown = True
                    
                if 'status_label' in globals():
                    status_label.config(text=f"Status: Warning - No face detected ({int(elapsed)}s)", foreground="orange")
                
                if elapsed >= self.timeout:
                    # Output JSON event
                    if '--video-mode' in sys.argv:
                        event = {
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                            "type": "alert",
                            "face_count": 0,
                            "elapsed": int(elapsed),
                            "message": "Student not watching - timeout reached"
                        }
                        print(json.dumps(event), flush=True)
                    else:
                        # Only lock screen in non-video mode
                        if self.enable_notifications:
                            notify_user("Locking", "No face detected. Locking now.")
                        if self.enable_sound and platform.system() == "Windows":
                            winsound.MessageBeep(winsound.MB_ICONEXCLAMATION)
                        lock_screen()
                    
                    self.last_face_time = time.time()
                    self.warning_shown = False
                    
                    if 'status_label' in globals():
                        status_label.config(text="Status: Locked screen", foreground="red")
                else:
                    if 'status_label' in globals():
                        status_label.config(text=f"Status: No face detected ({int(elapsed)}s)", foreground="red")

            try:
                cv2.imshow("Face Monitor Preview", frame_resized)
                # Set window properties
                cv2.setWindowProperty("Face Monitor Preview", cv2.WND_PROP_TOPMOST, 1)
            except Exception as e:
                log_event(f"Error displaying preview: {e}")

            # Wait for key press or interval
            key = cv2.waitKey(1) & 0xFF
            if key == 27:  # ESC
                break
                
            time.sleep(self.check_interval)

        if self.cap:
            self.cap.release()
        cv2.destroyAllWindows()

    def download_model_files(self):
        # Placeholder for model download functionality
        log_event("Please download the model files from:")
        log_event("https://github.com/opencv/opencv_3rdparty/raw/dnn_samples_face_detector_20170830/")
        log_event("and place them in the same directory as this script.")
        
    def stop(self):
        self.running = False
        if self.cap:
            self.cap.release()


# -------------------- GUI Setup --------------------
def start_monitoring():
    global monitor
    settings = load_settings()
    
    if 'monitor' in globals() and monitor.is_alive():
        messagebox.showinfo("Info", "Monitoring is already running.")
        return
        
    monitor = MonitorThread(
        sensitivity=settings["sensitivity"],
        timeout=settings["timeout"],
        preview_size=settings["preview_size"],
        check_interval=settings["check_interval"],
        enable_notifications=settings["enable_notifications"],
        enable_sound=settings["enable_sound"]
    )
    monitor.start()
    start_btn.config(state=tk.DISABLED)
    stop_btn.config(state=tk.NORMAL)
    log_event("Monitoring started.")


def stop_monitoring():
    if "monitor" in globals() and monitor.is_alive():
        monitor.stop()
        monitor.join(timeout=2.0)
        start_btn.config(state=tk.NORMAL)
        stop_btn.config(state=tk.DISABLED)
        status_label.config(text="Status: Stopped", foreground="gray")
        log_event("Monitoring stopped.")


def save_current_settings():
    settings = {
        "sensitivity": int(sensitivity_var.get()),
        "timeout": int(timeout_var.get()),
        "preview_size": int(preview_size_var.get()),
        "autostart": bool(autostart_var.get()),
        "enable_sound": bool(enable_sound_var.get()),
        "enable_notifications": bool(enable_notifications_var.get()),
        "check_interval": float(check_interval_var.get()),
        "show_logs": bool(show_logs_var.get())
    }
    save_settings(settings)

    if settings["autostart"]:
        enable_autostart()
    else:
        disable_autostart()
        
    # Apply log visibility setting
    toggle_logs_visibility()

    messagebox.showinfo("Settings", "Settings saved and applied.")


def on_closing():
    if messagebox.askokcancel("Quit", "Do you want to quit? This will stop monitoring."):
        stop_monitoring()
        root.destroy()


def minimize_to_tray():
    root.withdraw()
    
    def create_tray_icon():
        # Create an image for the tray icon
        width = 64
        height = 64
        image = Image.new('RGB', (width, height), (0, 0, 0, 0))
        dc = ImageDraw.Draw(image)
        dc.rectangle([(width//4, height//4), (3*width//4, 3*height//4)], fill=(0, 128, 255))
        dc.ellipse([(width//3, height//3), (2*width//3, 2*height//3)], fill=(255, 255, 255))
        
        return image

    def on_quit(icon, item):
        stop_monitoring()
        icon.stop()
        root.quit()

    def show_window(icon, item):
        icon.stop()
        root.after(0, root.deiconify)
        root.after(0, root.lift)

    def toggle_monitoring(icon, item):
        if "monitor" in globals() and monitor.is_alive():
            stop_monitoring()
        else:
            start_monitoring()

    # Create menu
    monitoring_text = "Stop Monitoring" if "monitor" in globals() and monitor.is_alive() else "Start Monitoring"
    menu = (
        item('Show', show_window),
        item(monitoring_text, toggle_monitoring),
        item('Quit', on_quit)
    )
    
    image = create_tray_icon()
    icon = Icon("Face Monitor", image, menu=menu)
    
    def run_icon():
        icon.run()
    
    threading.Thread(target=run_icon, daemon=True).start()


def open_help():
    webbrowser.open("https://github.com/yourusername/face-monitor/wiki")


def create_tooltip(widget, text):
    def enter(event):
        tooltip = tk.Toplevel()
        tooltip.wm_overrideredirect(True)
        tooltip.wm_geometry(f"+{event.x_root+10}+{event.y_root+10}")
        label = ttk.Label(tooltip, text=text, background="yellow", relief="solid", borderwidth=1)
        label.pack()
        widget.tooltip = tooltip
        
    def leave(event):
        if hasattr(widget, 'tooltip'):
            widget.tooltip.destroy()
            
    widget.bind("<Enter>", enter)
    widget.bind("<Leave>", leave)


def toggle_logs_visibility():
    settings = load_settings()
    if settings["show_logs"]:
        log_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        toggle_logs_btn.config(text="Hide Logs")
    else:
        log_frame.pack_forget()
        toggle_logs_btn.config(text="Show Logs")


def toggle_logs():
    settings = load_settings()
    settings["show_logs"] = not settings["show_logs"]
    save_settings(settings)
    toggle_logs_visibility()


# -------------------- Main Window --------------------
def create_gui():
    global root, log_text, sensitivity_var, timeout_var
    global preview_size_var, autostart_var, enable_sound_var, enable_notifications_var
    global check_interval_var, start_btn, stop_btn, status_label, log_frame, show_logs_var, toggle_logs_btn
    
    root = tk.Tk()
    root.title("Face Monitor")
    root.geometry("600x650")
    root.protocol("WM_DELETE_WINDOW", on_closing)

    settings = load_settings()

    # Configure style
    style = ttk.Style()
    style.theme_use('clam')

    # Label styles
    style.configure("Title.TLabel", font=("Arial", 16, "bold"), foreground="navy")
    style.configure("Status.TLabel", font=("Arial", 10, "bold"))

    # Button styles
    style.configure("TButton", padding=6, relief="raised", font=("Arial", 10))
    style.map("Green.TButton",
              background=[("active", "#45a049"), ("!disabled", "#4CAF50")],
              foreground=[("!disabled", "white")])
    style.map("Red.TButton",
              background=[("active", "#e74c3c"), ("!disabled", "#ff6b6b")],
              foreground=[("!disabled", "white")])
    style.map("Blue.TButton",
              background=[("active", "#1976D2"), ("!disabled", "#2196F3")],
              foreground=[("!disabled", "white")])

    # Create main frame
    main_frame = ttk.Frame(root, padding="10")
    main_frame.pack(fill=tk.BOTH, expand=True)

    ttk.Label(main_frame, text="Face Monitor", style="Title.TLabel").pack(pady=10)

    # Status label
    status_label = ttk.Label(main_frame, text="Status: Not started", style="Status.TLabel")
    status_label.pack(pady=5)

    btn_frame = ttk.Frame(main_frame)
    btn_frame.pack(fill=tk.X, pady=5)

    start_btn = ttk.Button(btn_frame, text="Start Monitoring", style="Green.TButton", command=start_monitoring)
    start_btn.pack(side=tk.LEFT, padx=5)

    stop_btn = ttk.Button(btn_frame, text="Stop Monitoring", style="Red.TButton", command=stop_monitoring, state=tk.DISABLED)
    stop_btn.pack(side=tk.LEFT, padx=5)

    ttk.Button(btn_frame, text="Minimize to Tray", style="Blue.TButton", command=minimize_to_tray).pack(side=tk.LEFT, padx=5)
    ttk.Button(btn_frame, text="Help", command=open_help).pack(side=tk.RIGHT, padx=5)

    # Settings frame
    settings_frame = ttk.LabelFrame(main_frame, text="Settings", padding="10")
    settings_frame.pack(fill=tk.X, pady=10)

    # Create a grid for settings
    sensitivity_var = tk.IntVar(value=settings["sensitivity"])
    timeout_var = tk.IntVar(value=settings["timeout"])
    preview_size_var = tk.IntVar(value=settings["preview_size"])
    autostart_var = tk.BooleanVar(value=settings["autostart"])
    enable_sound_var = tk.BooleanVar(value=settings["enable_sound"])
    enable_notifications_var = tk.BooleanVar(value=settings["enable_notifications"])
    check_interval_var = tk.DoubleVar(value=settings["check_interval"])
    show_logs_var = tk.BooleanVar(value=settings["show_logs"])

    ttk.Label(settings_frame, text="Sensitivity (s):").grid(row=0, column=0, sticky=tk.W, pady=2)
    ttk.Spinbox(settings_frame, from_=1, to=30, textvariable=sensitivity_var, width=10).grid(row=0, column=1, pady=2)
    create_tooltip(settings_frame, "How many seconds before timeout to show warning")

    ttk.Label(settings_frame, text="Timeout (s):").grid(row=1, column=0, sticky=tk.W, pady=2)
    ttk.Spinbox(settings_frame, from_=5, to=300, textvariable=timeout_var, width=10).grid(row=1, column=1, pady=2)
    create_tooltip(settings_frame, "Seconds without face detection before locking")

    ttk.Label(settings_frame, text="Preview Size:").grid(row=2, column=0, sticky=tk.W, pady=2)
    ttk.Spinbox(settings_frame, from_=100, to=500, textvariable=preview_size_var, width=10).grid(row=2, column=1, pady=2)
    create_tooltip(settings_frame, "Size of the preview window in pixels")

    ttk.Label(settings_frame, text="Check Interval (s):").grid(row=0, column=2, sticky=tk.W, pady=2, padx=(20, 0))
    ttk.Spinbox(settings_frame, from_=0.1, to=5.0, increment=0.1, textvariable=check_interval_var, width=10).grid(row=0, column=3, pady=2)
    create_tooltip(settings_frame, "How often to check for faces")

    ttk.Checkbutton(settings_frame, text="Enable Notifications", variable=enable_notifications_var).grid(row=1, column=2, columnspan=2, sticky=tk.W, pady=2, padx=(20, 0))
    ttk.Checkbutton(settings_frame, text="Enable Sound", variable=enable_sound_var).grid(row=2, column=2, columnspan=2, sticky=tk.W, pady=2, padx=(20, 0))
    ttk.Checkbutton(settings_frame, text="Start with System", variable=autostart_var).grid(row=3, column=2, columnspan=2, sticky=tk.W, pady=2, padx=(20, 0))
    ttk.Checkbutton(settings_frame, text="Show Logs", variable=show_logs_var).grid(row=4, column=2, columnspan=2, sticky=tk.W, pady=2, padx=(20, 0))

    ttk.Button(settings_frame, text="Save Settings", style="Blue.TButton", command=save_current_settings).grid(row=4, column=0, columnspan=2, pady=10)

    # Logs toggle button
    logs_btn_frame = ttk.Frame(main_frame)
    logs_btn_frame.pack(fill=tk.X, pady=5)
    
    toggle_logs_btn = ttk.Button(logs_btn_frame, text="Hide Logs", command=toggle_logs)
    toggle_logs_btn.pack(side=tk.LEFT)

    # Log frame
    log_frame = ttk.LabelFrame(main_frame, text="Logs", padding="10")
    
    # Apply initial log visibility setting
    if settings["show_logs"]:
        log_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        toggle_logs_btn.config(text="Hide Logs")
    else:
        toggle_logs_btn.config(text="Show Logs")

    log_text = scrolledtext.ScrolledText(log_frame, height=10, state=tk.DISABLED)
    log_text.pack(fill=tk.BOTH, expand=True)

    # Add some introductory text
    log_event("Face Monitor started. Configure settings and click 'Start Monitoring' to begin.")
    log_event("Note: For best results, ensure good lighting and camera positioning.")
    log_event("This application will only allow exactly one face. Multiple faces will trigger a warning.")

    return root


# -------------------- Video Monitoring Mode --------------------
def video_monitoring_mode():
    """Run in headless mode for video monitoring"""
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--session-id", type=str, help="Monitoring session ID")
    parser.add_argument("--course-id", type=str, help="Course ID")
    parser.add_argument("--lesson-id", type=str, help="Lesson ID")
    parser.add_argument("--sensitivity", type=int, default=5, help="Sensitivity in seconds")
    parser.add_argument("--timeout", type=int, default=10, help="Timeout in seconds")
    parser.add_argument("--check-interval", type=float, default=1.0, help="Check interval")
    
    args, unknown = parser.parse_known_args()
    
    # Log session start
    session_info = {
        "session_id": args.session_id,
        "course_id": args.course_id,
        "lesson_id": args.lesson_id,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "type": "session_start"
    }
    print(json.dumps(session_info), flush=True)
    
    # Create monitor thread without GUI
    global monitor
    monitor = MonitorThread(
        sensitivity=args.sensitivity,
        timeout=args.timeout,
        preview_size=300,
        check_interval=args.check_interval,
        enable_notifications=True,
        enable_sound=False  # Disable sound in video mode
    )
    
    try:
        monitor.start()
        
        # Keep running until interrupted
        while monitor.is_alive():
            time.sleep(1)
            
            # Output status periodically
            if hasattr(monitor, 'face_count'):
                status = {
                    "session_id": args.session_id,
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "type": "status",
                    "face_count": monitor.face_count,
                    "monitoring": monitor.running
                }
                print(json.dumps(status), flush=True)
                
    except KeyboardInterrupt:
        print(json.dumps({
            "session_id": args.session_id,
            "type": "session_end",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }), flush=True)
    finally:
        if monitor and monitor.is_alive():
            monitor.stop()
            monitor.join(timeout=2.0)


# -------------------- Entry Point --------------------
if __name__ == "__main__":
    # Check for video monitoring mode
    if "--video-mode" in sys.argv:
        video_monitoring_mode()
    else:
        hidden_mode = "--hidden" in sys.argv
        
        # Create the GUI first
        root = create_gui()
        
        if hidden_mode:
            # Start monitoring and minimize to tray
            start_monitoring()
            minimize_to_tray()
        
        root.mainloop()