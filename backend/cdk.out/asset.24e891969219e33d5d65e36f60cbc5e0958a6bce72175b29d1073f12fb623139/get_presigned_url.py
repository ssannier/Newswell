import boto3
import json
import os

s3 = boto3.client('s3')
BUCKET_NAME = os.getenv('BUCKET_NAME')

def lambda_handler(event, context):
    try:
        if 'body' in event:
            event_body = json.loads(event['body'])  # Parse the body string
        else:
            event_body = event  # If directly from Lambda test, it will not be stringified
        
        # Access the 'id' from the body
        file_id = event_body['id']
        file_name = file_id + ".jpg"
        

        # Generate a presigned URL for the file
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': file_name},
            ExpiresIn=3600  # URL expiration time in seconds
        )

        return {
            'statusCode': 200,
            'body': json.dumps(presigned_url),
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'  # Allowed methods
                }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}',
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'  # Allowed methods
                }
        }
