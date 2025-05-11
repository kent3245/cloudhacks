import boto3
from typing import List
from config import AWS_REGION, BUCKET_NAME
import time

# initialize your AWS clients once
_s3 = boto3.client("s3", region_name=AWS_REGION)
_textract = boto3.client("textract", region_name=AWS_REGION)

def upload_file(key: str, local_path: str) -> None:
    """
    upload the file at local_path into your S3 bucket
    under the given key/name
    """
    _s3.upload_file(local_path, BUCKET_NAME, key)

def detect_text(key: str) -> List[str]:
    """Asynchronously OCR a (multi-page) PDF in S3, returning all lines."""
    # 1) kick off the job
    job = _textract.start_document_text_detection(
        DocumentLocation={"S3Object": {"Bucket": BUCKET_NAME, "Name": key}}
    )
    job_id = job["JobId"]

    # 2) poll until finished
    while True:
        resp = _textract.get_document_text_detection(JobId=job_id)
        status = resp["JobStatus"]
        if status in ("SUCCEEDED", "FAILED"):
            break
        time.sleep(1)

    if status != "SUCCEEDED":
        raise RuntimeError(f"Textract job {job_id} failed")

    # 3) gather text from all pages
    pages = []
    next_token = None
    while True:
        kwargs = {"JobId": job_id}
        if next_token:
            kwargs["NextToken"] = next_token
        part = _textract.get_document_text_detection(**kwargs)
        blocks = part["Blocks"]
        pages.extend([b["Text"] for b in blocks if b["BlockType"] == "LINE"])
        next_token = part.get("NextToken")
        if not next_token:
            break

    return pages