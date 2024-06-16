# server/app/utils.py

from base64 import b64decode
from config.aws_amplify_config import get_s3_client, AWS_CONFIG

def upload_to_s3(file_name, file_type, file_content):
    s3 = get_s3_client()
    file_content_bytes = b64decode(file_content)
    try:
        s3.put_object(
            Bucket=AWS_CONFIG['s3_bucket'],
            Key=file_name,
            Body=file_content_bytes,
            ContentType=file_type
        )
        file_url = f"https://{AWS_CONFIG['s3_bucket']}.s3.{AWS_CONFIG['region_name']}.amazonaws.com/{file_name}"
        return file_url
    except NoCredentialsError:
        raise Exception("Credentials not available")
