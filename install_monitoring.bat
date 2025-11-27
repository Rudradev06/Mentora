@echo off
echo ========================================
echo   Mentora Video Monitoring Setup
echo ========================================
echo.

echo Installing Python dependencies...
echo.

pip install opencv-python numpy plyer pystray pillow

echo.
echo ========================================
echo   Testing Installation
echo ========================================
echo.

python -c "import cv2; import numpy; import plyer; import pystray; from PIL import Image; print('✓ All dependencies installed successfully!')"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Testing Camera Access
    echo ========================================
    echo.
    
    python -c "import cv2; cap = cv2.VideoCapture(0); print('✓ Camera access OK' if cap.isOpened() else '✗ Camera access failed'); cap.release()"
    
    echo.
    echo ========================================
    echo   Installation Complete!
    echo ========================================
    echo.
    echo You can now use video monitoring features.
    echo.
    echo To test the monitoring script:
    echo   python p3.py --video-mode --session-id=test
    echo.
    echo To start the full application:
    echo   start.bat
    echo.
) else (
    echo.
    echo ✗ Installation failed. Please check the errors above.
    echo.
)

pause
