import dotenv
dotenv.load_dotenv()

import boto3
import botocore
import os
import re

def connect_to_bedrock():
    # Initialize Bedrock client
    region = os.getenv("AWS_REGION")
    bedrock = boto3.client(service_name='bedrock-runtime', region_name=region)
    return bedrock

def make_body(text,seconds):
    tokens_per_second = 10  # assume fast-paced dialogue (conversational)
    max_tokens = int(seconds * tokens_per_second + 200)  # buffer for context and safety

    converse_request = {
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "text": text + "\nEnd the dialogue naturally with a funny or insightful closing line. Don't include physical actions pure transcripts" 
                }
            ]
        }
    ],
        "inferenceConfig": {
            "temperature": 0.4,
            "topP": 0.9,
            "maxTokens": max_tokens
        }
    }
    return converse_request

def strip_stage_directions(text: str) -> str:
    return re.sub(r"\*[^*]+\*", "", text)

def make_request(bedrock,converse_request):
    try:
        response = bedrock.converse(
            modelId="anthropic.claude-3-5-haiku-20241022-v1:0",
            messages=converse_request["messages"],
            inferenceConfig=converse_request["inferenceConfig"]
        )
        
        # Extract the model's response
        claude_converse_response = response["output"]["message"]["content"][0]["text"]
        return claude_converse_response
    except botocore.exceptions.ClientError as error:
        if error.response['Error']['Code'] == 'AccessDeniedException':
            print(f"\x1b[41m{error.response['Error']['Code']}: {error.response['Error']['Message']}\x1b[0m")
            print("Please ensure you have the necessary permissions for Amazon Bedrock.")
        else:
            raise error


def text_to_script(text,seconds,person_1,person_2):
    """
    person_1: The first character in the dialogue (e.g., Jeff Bezos)
    person_2: The second character in the dialogue (e.g., Stewie Griffin)
    seconds: The duration of the video in seconds
    text: The text to be converted into a script
    """

    bedrock = connect_to_bedrock()
    
    PROMPT = f"""
    You are creating a fun and informative short video script, no longer than {seconds} seconds. The format is a \n \
    dialogue between two characters: Jeff Bezos (the curious learner) and Stewie Griffin (the expert).\n
    The topic is based on the following text:\n
    {text}\n
    Write a script where {person_1} asks engaging, beginner-friendly questions and {person_2} answers clearly and concisely. Make it sound natural,\n \
    like a conversation between two people. Keep the tone lively, slightly humorous, and easy to follow. Avoid quoting the source text verbatim—explain\n \
    things in a way viewers would enjoy on TikTok or Instagram Reels.\n
    Also don't give any stage directions or actions, just the dialogue.\n
    Also do not include (laughs) or (applause) or any other stage directions.\n
    Format:\n
    {person_1}: ...\n
    {person_2}: ...\n
    ...
    """

    body = make_body(PROMPT,seconds)

    response = make_request(bedrock, body)

    return response

def make_text_file(text, seconds, person_1, person_2):
    """
    Creates a text file for each line of the script
    with number and the name of the person talking,
    and stores them in the specified folder.
    """
    folder = "script_lines"
    os.makedirs(folder, exist_ok=True)
    script = text_to_script(text, seconds, person_1, person_2)
    print(script)
    scripts = [line for line in script.split("\n")[1:] if line.strip()]
    
    for i, line in enumerate(scripts):
        if line.startswith(person_1):
            filename = os.path.join(folder, f"{i} {person_1}.txt")
            with open(filename, "w", encoding="utf-8") as f:
                f.write(line.split(":", 1)[1].strip())
        elif line.startswith(person_2):
            filename = os.path.join(folder, f"{i} {person_2}.txt")
            with open(filename, "w", encoding="utf-8") as f:
                f.write(line.split(":", 1)[1].strip())


if __name__ == "__main__":
    make_text_file("Describe AWS Bedrock and its features", 60, "Jeff Bezos", "Stewie Griffin")
