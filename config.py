# config.py
from dotenv import load_dotenv
import os

load_dotenv()  # looks for .env in your project root

AWS_REGION  = os.getenv('AWS_REGION')
BUCKET_NAME = os.getenv('BUCKET_NAME')
