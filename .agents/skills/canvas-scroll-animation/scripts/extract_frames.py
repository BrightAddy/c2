"""
extract_frames.py - High Performance Video Frame Extractor for Canvas Scroll Animations

Extracts an evenly-spaced sequence of frames from any video file and saves them
as compressed WebP images optimized for canvas-based scrub animations.

Requirements:
    pip install opencv-python numpy

Usage:
    python extract_frames.py --video path/to/video.mp4 --output public/frames --frames 150 --quality 85
"""

import os
import argparse
import cv2
import numpy as np


def extract_frames(video_path: str, output_dir: str, target_frames: int = 150, quality: int = 85, max_width: int = 1920):
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    os.makedirs(output_dir, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    print(f"Loaded: {video_path}")
    print(f"Original: {orig_w}x{orig_h} @ {fps:.1f} fps, {total_frames} total frames")
    print(f"Target: {target_frames} frames -> {output_dir}/ (quality={quality})")

    # Generate evenly spaced indices across the entire duration
    indices = np.linspace(0, total_frames - 1, target_frames, dtype=int)

    extracted_count = 0
    for idx, target_idx in enumerate(indices):
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(target_idx))
        ret, frame = cap.read()
        if not ret:
            print(f"Warning: Failed to read frame at index {target_idx}")
            continue

        # Optional downscale if wider than max_width to keep file sizes small
        h, w = frame.shape[:2]
        if w > max_width:
            scale = max_width / float(w)
            new_w = max_width
            new_h = int(h * scale)
            frame = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)

        out_name = os.path.join(output_dir, f"frame_{idx:03d}.webp")
        cv2.imwrite(out_name, frame, [cv2.IMWRITE_WEBP_QUALITY, quality])
        extracted_count += 1

        if (idx + 1) % 25 == 0 or idx == target_frames - 1:
            print(f"Progress: {idx + 1}/{target_frames} frames processed")

    cap.release()
    print(f"Done! Successfully extracted {extracted_count} frames to {output_dir}")


def main():
    parser = argparse.ArgumentParser(description="Extract video frames to WebP sequence for scroll animation")
    parser.add_argument("--video", "-v", required=True, help="Path to input video (.mp4, .mov, etc.)")
    parser.add_argument("--output", "-o", default="public/frames", help="Output directory for frames (default: public/frames)")
    parser.add_argument("--frames", "-f", type=int, default=150, help="Number of frames to extract (default: 150)")
    parser.add_argument("--quality", "-q", type=int, default=85, help="WebP compression quality 1-100 (default: 85)")
    parser.add_argument("--max-width", "-w", type=int, default=1920, help="Max image width (default: 1920)")

    args = parser.parse_args()
    extract_frames(args.video, args.output, args.frames, args.quality, args.max_width)


if __name__ == "__main__":
    main()
