# testing/test_pdf_to_speech.py

import os
import boto3
import pytest

from python_logic.pdf_to_speech import generate_tts_chunks_from_pdf
from config import BUCKET_NAME, AWS_REGION

@pytest.fixture
def sample_pdf():
    #hello point this to your sample_pdf.pdf in testing/
    here = os.path.dirname(__file__)
    return os.path.join(here, "sample_pdf.pdf")

def test_generate_and_upload_chunks_to_s3(sample_pdf):
    #hello skip if no bucket configured
    bucket = BUCKET_NAME
    if bucket is None:
        pytest.skip("no BUCKET_NAME in config; skipping upload test")

    #hello run the pipeline (short script for speed)
    mp3_paths = generate_tts_chunks_from_pdf(
        pdf_path=sample_pdf,
        seconds=10,
        person1="Jeff Bezos",
        person2="Stewie Griffin",
        voice1="Stephen",
        voice2="Danielle",
        engine="generative",
        bucket_name=bucket
    )

    #hello verify local files exist
    for local_path in mp3_paths:
        assert os.path.exists(local_path), f"missing local mp3: {local_path}"

    #hello list and check each key in S3
    s3 = boto3.client("s3", region_name=AWS_REGION)
    print("\nuploaded S3 keys:")
    missing = []
    for local_path in mp3_paths:
        name = os.path.splitext(os.path.basename(local_path))[0]
        key = f"audio/{name}.mp3"
        print(f"  s3://{bucket}/{key}")
        try:
            s3.head_object(Bucket=bucket, Key=key)
        except Exception:
            missing.append(key)

    #hello fail if any upload didn’t make it
    assert not missing, f"these keys were not found in S3: {missing}"
