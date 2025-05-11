#!/usr/bin/env python3
import sys
import os
from aws_calls.aws_pdf_to_text import transcribe_pdf_to_text

def main():
    AWS_REGION = os.getenv('AWS_REGION')
    BUCKET_NAME = os.getenv('BUCKET_NAME')
    print("DEBUG: AWS_REGION=", AWS_REGION, "BUCKET_NAME=", BUCKET_NAME)

    if len(sys.argv) < 2:
        print("usage: python -m testing.run_pdf_transcribe path/to/file.pdf [output_name.txt]")
        sys.exit(1)

    pdf_path = sys.argv[1]
    output_name = sys.argv[2] if len(sys.argv) >= 3 else None

    result = transcribe_pdf_to_text(
        local_path=pdf_path,
        output_filename=output_name
    )
    print(f"\n→ transcript written to {result}")

if __name__ == "__main__":
    main()
