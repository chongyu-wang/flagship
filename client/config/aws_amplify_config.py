# server/config/aws_amplify_config.py

import boto3
from dotenv import load_dotenv
import os

load_dotenv()

aws_access_key_id = os.getenv("S3_ACCESS_KEY")
aws_secret_access_key = os.getenv("S3_SECRET_KEY")
endpoint = os.getenv("S3_ENDPOINT")
region = os.getenv("S3_REGION")
bucket_name = os.getenv("S3_BUCKET")

# AWS Amplify configuration
AWS_CONFIG = {
    'access_key_id': aws_access_key_id,
    'secret_access_key': aws_secret_access_key,
    'region_name': region,
    's3_bucket': bucket_name
}

def get_s3_client():
    return boto3.client(
        's3',
        aws_access_key_id=AWS_CONFIG['access_key_id'],
        aws_secret_access_key=AWS_CONFIG['secret_access_key'],
        region_name=AWS_CONFIG['region_name']
    )
