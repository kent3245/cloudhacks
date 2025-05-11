import dotenv
dotenv.load_dotenv()

import boto3
import botocore
import os

def connect_to_bedrock():
    # Initialize Bedrock client
    region = os.getenv("AWS_REGION")
    bedrock = boto3.client(service_name='bedrock-runtime', region_name=region)
    return bedrock

def make_body(text,seconds):
    converse_request = {
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "text": text
                }
            ]
        }
    ],
        "inferenceConfig": {
            "temperature": 0.4,
            "topP": 0.9,
            "maxTokens": 150*round(seconds/60)+100
        }
    }
    return converse_request


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
    Format:\n
    {person_1}: ...\n
    {person_2}: ...\n
    ...
    """

    body = make_body(PROMPT.format(seconds=seconds, person_1=person_1, person_2=person_2, text=text),seconds)

    response = make_request(bedrock, body)

    return response


if __name__ == "__main__":
    print(text_to_script("Dynamic Programming",60,"Jeff Bezos","Stewie Griffin"))

