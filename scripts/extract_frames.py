import os
import cv2
import numpy as np

video_path = "public/video/gemini_generated_video_f18ed076.mp4"
output_dir = "public/frames"
os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Total video frames: {total_frames}")

TARGET_FRAMES = 150
indices = np.linspace(0, total_frames - 1, TARGET_FRAMES, dtype=int)

extracted_count = 0
for idx, target_idx in enumerate(indices):
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(target_idx))
    ret, frame = cap.read()
    if not ret:
        print(f"Failed to read frame at {target_idx}")
        continue
    out_name = os.path.join(output_dir, f"frame_{idx:03d}.webp")
    # Save as 720p WebP with quality 85
    cv2.imwrite(out_name, frame, [cv2.IMWRITE_WEBP_QUALITY, 85])
    extracted_count += 1

cap.release()
print(f"Successfully extracted {extracted_count} frames to {output_dir}")
