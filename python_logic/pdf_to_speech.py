import os
import boto3
import dotenv
from typing import List

dotenv.load_dotenv()

from aws_calls.aws_pdf_to_text import transcribe_pdf_to_text
from aws_calls.aws_text_to_script import make_text_file
from config import AWS_REGION, BUCKET_NAME

def generate_tts_chunks_from_pdf(
    pdf_path: str,
    seconds: int = 60,
    person1: str = "Jeff Bezos",
    person2: str = "Stewie Griffin",
    voice1: str = "Stephen",
    voice2: str = "Danielle",
    engine: str = "generative",
    bucket_name: str = "audio"
) -> List[str]:
    print("▶️ starting TTS chunk pipeline")

    # 1) transcribe pdf → plain‑text file
    print("1) running Textract on PDF...")
    txt_path = transcribe_pdf_to_text(pdf_path)
    print(f"   ✅ transcription complete: {txt_path}")

    # 2) load entire transcript into memory
    print("2) loading transcript into memory...")
    with open(txt_path, "r", encoding="utf-8") as f:
        text = f.read()
    print(f"   ✅ transcript loaded ({len(text)} chars)")

    # 3) split the transcript into individual lines in script_lines/
    print("3) splitting transcript into script_lines/ …")
    make_text_file(text, seconds, person1, person2)
    print("   ✅ split complete; check script_lines/ for individual .txt files")

    # 4) prepare an output folder for MP3s
    audio_folder = "audio_chunks"
    os.makedirs(audio_folder, exist_ok=True)
    print(f"4) audio output folder ready: {audio_folder}")

    # 5) init clients
    print("5) initializing AWS clients…")
    polly = boto3.client("polly", region_name=AWS_REGION)
    if bucket_name:
        s3 = boto3.client("s3", region_name=AWS_REGION)
        print(f"   S3 uploads enabled to bucket: {bucket_name}")
    else:
        print("   direct Polly mode (no S3)")

    mp3_paths: List[str] = []

    # 6) process each numbered .txt in script_lines/
    files = sorted(os.listdir("script_lines"))
    print(f"6) synthesizing {len(files)} chunks…")
    for fname in files:
        if not fname.endswith(".txt"):
            continue

        base = os.path.splitext(fname)[0]
        file_path = os.path.join("script_lines", fname)
        with open(file_path, "r", encoding="utf-8") as f:
            line_text = f.read()

        # choose a voice
        if person1 in fname:
            chosen_voice = voice1
        else:
            chosen_voice = voice2

        print(f"   • chunk '{base}': using voice '{chosen_voice}' …")
        resp = polly.synthesize_speech(
            Text=line_text,
            VoiceId=chosen_voice,
            Engine=engine,
            OutputFormat="mp3"
        )

        # write out the mp3
        out_mp3 = os.path.join(audio_folder, f"{base}.mp3")
        with open(out_mp3, "wb") as out_f:
            out_f.write(resp["AudioStream"].read())
        mp3_paths.append(out_mp3)
        print(f"     ✔️ generated {out_mp3}")

        # optionally upload to S3
        if bucket_name:
            key = f"audio/{base}.mp3"
            s3.upload_file(out_mp3, bucket_name, key)
            print(f"     ☁️ uploaded to s3://{bucket_name}/{key}")

    print("✅ all chunks processed")
    return mp3_paths

if __name__ == "__main__":
    # hardcoded test call — update the path as needed
    generate_tts_chunks_from_pdf("testing/sample_pdf.pdf")

