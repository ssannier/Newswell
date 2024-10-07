import boto3
import json

s3 = boto3.client('s3')
BUCKET_NAME = 'samplenewswell1'

def lambda_handler(event, context):
    try:
        # Extract the file ID from the request
        # body = event['body']
        # Access the 'id' from the body
        file_id = event['id']
        # return {
        #     'statusCode': 200,
        #     'body': file_id
        # }
        file_name = file_id + ".jpg"
        

        # Generate a presigned URL for the file
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': file_name},
            ExpiresIn=3600  # URL expiration time in seconds
        )

        return {
            'statusCode': 200,
            'body': presigned_url,
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
