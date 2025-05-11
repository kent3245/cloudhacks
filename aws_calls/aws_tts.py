# aws_calls/aws_tts.py

import os
import sys
import boto3


# 1) compute project root (one level up from aws_calls/)
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# 2) insert it onto sys.path if not already present
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from config import AWS_REGION, BUCKET_NAME

def synthesize_speech_from_s3(
    bucket_name,
    object_key,
    voice="Matthew",
    engine="neural",
    output="speech.mp3"
):
    s3    = boto3.client("s3", region_name=AWS_REGION)
    polly = boto3.client("polly", region_name=AWS_REGION)

    resp = s3.get_object(Bucket=bucket_name, Key=object_key)
    text = resp["Body"].read().decode("utf-8").strip()

    polly_resp = polly.synthesize_speech(
        Text=text,
        VoiceId=voice,
        Engine=engine,
        OutputFormat="mp3"
    )
    with open(output, "wb") as out_f:
        out_f.write(polly_resp["AudioStream"].read())

    print(f"Saved speech to {output}")

# def main():
#     if len(sys.argv) not in (3, 4):
#         print("Usage: python -m aws_calls.aws_tts <bucket> <key> [<output.mp3>]")
#         sys.exit(1)
#
#     bucket = sys.argv[1]
#     key    = sys.argv[2]
#     out    = sys.argv[3] if len(sys.argv) == 4 else "speech.mp3"
#
#     synthesize_speech_from_s3(bucket, key, output=out)
#
# if __name__ == "__main__":
#     main()