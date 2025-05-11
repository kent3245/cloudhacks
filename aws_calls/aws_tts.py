# aws_calls/aws_tts.py

import os
import boto3
from config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION

# shared Polly client factory
def _make_polly_client():
    return boto3.client(
        "polly",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION,
    )

def synthesize_speech_from_text(
    text: str,
    voice: str = "Matthew",
    engine: str = "neural",
    output: str = "speech.mp3",
    out_folder: str = "outputs"
):
    """
    Turn a raw text string into an MP3 saved under out_folder/output.
    """
    # ensure folder exists
    os.makedirs(out_folder, exist_ok=True)
    out_path = os.path.join(out_folder, output)

    polly = _make_polly_client()
    resp = polly.synthesize_speech(
        Text=text,
        VoiceId=voice,
        Engine=engine,
        OutputFormat="mp3"
    )

    # write the bytes
    with open(out_path, "wb") as fw:
        fw.write(resp["AudioStream"].read())

    print(f"saved speech to {out_path}")
    return out_path


def synthesize_speech_from_file(
    script_path: str,
    **kwargs
):
    """
    Read a local file and pass its contents to synthesize_speech_from_text.
    """
    with open(script_path, "r", encoding="utf-8") as f:
        text = f.read().strip()
    return synthesize_speech_from_text(text, **kwargs)


def synthesize_speech_from_s3(
    s3_bucket: str,
    s3_key: str,
    **kwargs
):
    """
    Fetch a text file from S3 and pass its contents to synthesize_speech_from_text.
    """
    s3 = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION,
    )
    obj = s3.get_object(Bucket=s3_bucket, Key=s3_key)
    text = obj["Body"].read().decode("utf-8").strip()
    return synthesize_speech_from_text(text, **kwargs)
