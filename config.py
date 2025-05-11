# config.py
from dotenv import load_dotenv
import os

load_dotenv()  # looks for .env in your project root


AWS_ACCESS_KEY_ID     = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION            = os.getenv('AWS_REGION')
BUCKET_NAME           = os.getenv('BUCKET_NAME')