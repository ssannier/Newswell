import json
import boto3
import os

# Initialize the S3 client
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    # Get the file name from the event (API Gateway parameters)
    try:
        id = event['queryStringParameters'].get('id')
    except KeyError:
        return {
            'statusCode': 400,
            'body': json.dumps('Error: parameter id is missing'),
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'  # Allowed methods
                }
        }
    
    # Define the S3 bucket name
    BUCKET_NAME = os.getenv('BUCKET_NAME')
    bucket_name = BUCKET_NAME
    file_extension = 'jpg'  # Assuming the user uploads a .jpg file
    file_name = f"{id}.{file_extension}"
    
    # Set the expiration time for the presigned URL (1 hour)
    expiration = 3600  # 1 hour = 3600 seconds
    
    try:
        # Generate the presigned URL for uploading
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={'Bucket': bucket_name, 'Key': file_name, 'ContentType': 'image/jpeg'},
            ExpiresIn=expiration
        )
        
        # Return the presigned URL and the file name to the client
        return {
            'statusCode': 200,
            'body': json.dumps({
                'url': presigned_url,
                'file_name': file_name
            }),
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
            'body': json.dumps('Error generating presigned URL: ' + str(e)),
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'  # Allowed methods
                }
        }
