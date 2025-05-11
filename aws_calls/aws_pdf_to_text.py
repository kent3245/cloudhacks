# aws_calls/aws_pdf_to_text.py

import os
from aws_calls.aws_client import upload_file, detect_text

def transcribe_pdf_to_text(
    local_path,             #filename to the pdf; path of pdf we want to transcribe
    output_filename=None,   #output name of file in outputs (optional)
    out_folder="outputs"    # Where to output it (optional)
):
    #derive the s3 key from the filename
    key = os.path.basename(local_path)

    #upload the pdf to s3
    upload_file(key, local_path)

    #call textract on the s3 object and get back lines
    lines = detect_text(key)

    #join all lines into one big string
    full_text = "\n".join(lines)

    #make sure the outputs folder exists
    os.makedirs(out_folder, exist_ok=True)

    #if no output filename given, use same base name as pdf
    if output_filename is None:
        base = os.path.splitext(key)[0]
        output_filename = f"{base}.txt"

    #build full path under outputs/
    output_path = os.path.join(out_folder, output_filename)

    #write the transcript to disk
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(full_text)

    print(f"saved transcript to {output_path}")
    return output_path
