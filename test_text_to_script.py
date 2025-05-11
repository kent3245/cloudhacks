# test_text_to_script.py

import os
import sys
from dotenv import load_dotenv

# make sure your project root is on PYTHONPATH
sys.path.insert(0, os.path.dirname(__file__))

load_dotenv()  # picks up AWS_ACCESS_KEY_ID, SECRET, REGION, BUCKET_NAME

from aws_calls.aws_text_to_script import text_to_script

def main():
    # 1) sample text to feed into Claude
    sample_text = (
        "AWS Bedrock is a fully managed service that makes it easy to "
        "build generative AI applications. Describe its key features and use cases."
    )

    # 2) run text_to_script (30‑second script, speakers Alice & Bob)
    try:
        script = text_to_script(sample_text, seconds=30, person_1="Alice", person_2="Bob")
    except Exception as e:
        print("❌ Failed to generate script:", e)
        sys.exit(1)

    # 3) print it out for inspection
    print("\n✅ Generated dialogue script:\n")
    print(script)
    print("\n(should see lines starting with 'Alice:' and 'Bob:')")

if __name__ == "__main__":
    main()
