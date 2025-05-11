# config.py
import os
from dotenv import load_dotenv
load_dotenv()  # this reads .env in the current working directory

AWS_ACCESS_KEY_ID     = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION            = os.getenv('AWS_REGION')
BUCKET_NAME           = os.getenv('AWS_BUCKET_NAME')