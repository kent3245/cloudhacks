#!/usr/bin/env python3
import os
import sys
import tempfile
import boto3

# ensure project root is on path so we can import config and aws_calls
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Use direct moviepy imports to avoid editor import issues
from moviepy import VideoFileClip, AudioFileClip, ImageClip, CompositeVideoClip, CompositeAudioClip
from config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, BUCKET_NAME


def sync_audio_video(
    bg_key='subwaySurfer_minute.mp4',
    charA_key='sample_charactor2.png',
    charB_key='sample_charactor1.png',
    audio_prefix='audio/',
    output_key='brainrot_final.mp4',
    fps=60,
    size_ratio=0.2
):
    """
    Downloads assets from S3, composes video with synced TTS audio and character overlays,
    renders at given fps, and uploads result back to S3 under output_key.
    """
    print("[INFO] Initializing S3 client...")
    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    s3 = session.client('s3')

    print(f"[INFO] Listing audio chunks in prefix '{audio_prefix}'...")
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=BUCKET_NAME, Prefix=audio_prefix)
    audio_keys = [obj['Key'] for p in pages for obj in p.get('Contents', []) if obj['Key'].lower().endswith('.mp3')]
    audio_keys.sort()
    print(f"[INFO] Found {len(audio_keys)} audio files: {audio_keys}")

    def dl(key):
        print(f"[INFO] Downloading S3://{BUCKET_NAME}/{key}...")
        fd, path = tempfile.mkstemp(suffix=os.path.splitext(key)[1])
        os.close(fd)
        s3.download_file(BUCKET_NAME, key, path)
        print(f"[INFO] Downloaded to {path}")
        return path

    video_path = dl(bg_key)
    charA_path = dl(charA_key)
    charB_path = dl(charB_key)
    audio_paths = [dl(k) for k in audio_keys]

    print(f"[INFO] Loading background video from {video_path}...")
    video = VideoFileClip(video_path).with_fps(fps)
    width, height = video.size
    print(f"[INFO] Video resolution: {width}x{height}, FPS: {fps}")

    print("[INFO] Building audio timeline and overlays...")
    audio_clips = []
    overlays = []
    start = 0.0
    for i, ap in enumerate(audio_paths):
        print(f"[INFO] Processing chunk {i}: {ap} starting at {start}s...")
        audio = AudioFileClip(ap)
        dur = audio.duration
        audio_clips.append(audio.with_start(start))

        img = charA_path if i % 2 == 0 else charB_path
        position = ('left', 'bottom') if i % 2 == 0 else ('right', 'bottom')
        img_clip = (
            ImageClip(img)
            .with_start(start)
            .with_duration(dur)
            .resized(width=width * size_ratio)
            .with_position(position)
        )
        overlays.append(img_clip)
        print(f"[INFO] Added overlay: {img} at {position} for {dur}s")
        start += dur

    print(f"[INFO] Combining {len(audio_clips)} audio clips...")
    final_audio = CompositeAudioClip(audio_clips)
    print(f"[INFO] Compositing video with overlays...")
    final_video = CompositeVideoClip([video, *overlays]).with_audio(final_audio)

    local_out = output_key
    print(f"[INFO] Rendering final video to {local_out}...")
    final_video.write_videofile(
        local_out,
        fps=fps,
        codec='libx264',
        audio_codec='aac',
        temp_audiofile=tempfile.NamedTemporaryFile(suffix='.m4a').name,
        remove_temp=True
    )
    final_video.close()

    print(f"[INFO] Uploading result to s3://{BUCKET_NAME}/{output_key}...")
    s3.upload_file(local_out, BUCKET_NAME, output_key)
    print(f"[INFO] Upload complete. File available at s3://{BUCKET_NAME}/{output_key}")

if __name__ == '__main__':
    print("[INFO] Starting sync_audio_video pipeline...")
    sync_audio_video()