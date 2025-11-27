#!/usr/bin/env python3
"""
Download DNN Face Detection Models for p3.py
This script downloads the required model files for high-accuracy face detection
"""

import urllib.request
import os
import sys

def download_file(url, filename):
    """Download a file with progress indication"""
    try:
        print(f"Downloading {filename}...")
        print(f"URL: {url}")
        
        def progress_hook(count, block_size, total_size):
            percent = int(count * block_size * 100 / total_size)
            sys.stdout.write(f"\r  Progress: {percent}%")
            sys.stdout.flush()
        
        urllib.request.urlretrieve(url, filename, progress_hook)
        print(f"\n✓ Downloaded {filename} successfully!")
        return True
    except Exception as e:
        print(f"\n✗ Failed to download {filename}: {e}")
        return False

def main():
    print("=" * 60)
    print("  DNN Face Detection Model Downloader")
    print("=" * 60)
    print()
    
    # Model files to download
    files = {
        "res10_300x300_ssd_iter_140000.caffemodel": {
            "url": "https://github.com/opencv/opencv_3rdparty/raw/dnn_samples_face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel",
            "size": "10.7 MB"
        },
        "deploy.prototxt": {
            "url": "https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy.prototxt",
            "size": "28 KB"
        }
    }
    
    # Check existing files
    print("Checking for existing files...")
    for filename in files.keys():
        if os.path.exists(filename):
            size = os.path.getsize(filename)
            print(f"  ✓ {filename} already exists ({size:,} bytes)")
        else:
            print(f"  ✗ {filename} not found")
    print()
    
    # Download missing files
    downloaded = 0
    failed = 0
    
    for filename, info in files.items():
        if os.path.exists(filename):
            print(f"Skipping {filename} (already exists)")
            continue
        
        print(f"\nDownloading {filename} ({info['size']})...")
        if download_file(info['url'], filename):
            downloaded += 1
        else:
            failed += 1
    
    # Summary
    print()
    print("=" * 60)
    print("  Download Summary")
    print("=" * 60)
    print(f"  Downloaded: {downloaded}")
    print(f"  Failed: {failed}")
    print(f"  Already existed: {len(files) - downloaded - failed}")
    print()
    
    # Verify files
    print("Verifying files...")
    all_present = True
    for filename in files.keys():
        if os.path.exists(filename):
            size = os.path.getsize(filename)
            print(f"  ✓ {filename} ({size:,} bytes)")
        else:
            print(f"  ✗ {filename} MISSING!")
            all_present = False
    
    print()
    if all_present:
        print("✓ All model files are ready!")
        print()
        print("You can now use DNN face detection with p3.py")
        print("The script will automatically use these models for high accuracy.")
        print()
        print("To test:")
        print("  python p3.py --video-mode --session-id=test")
        return 0
    else:
        print("✗ Some files are missing. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
