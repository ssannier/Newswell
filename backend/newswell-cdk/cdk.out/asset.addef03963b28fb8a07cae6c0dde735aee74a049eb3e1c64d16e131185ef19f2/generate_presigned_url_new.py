import json
import boto3
import uuid

# Initialize the S3 client
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    # Generate a unique file ID using UUID
    file_id = str(uuid.uuid4())
    
    # Define the S3 bucket name
    bucket_name = 'samplenewswell1'
    
    # Define the file extension and complete file name (file_id + .extension)
    file_extension = 'jpg'  # Assuming the user uploads a .jpg file, you can dynamically determine this
    file_name = f"{file_id}.{file_extension}"
    
    # Set the expiration time for the presigned URL (1 hour)
    expiration = 3600  # 1 hour = 3600 seconds
    
    try:
        # Generate the presigned URL for uploading
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={'Bucket': bucket_name, 'Key': file_name, 'ContentType': 'image/jpeg'},
            ExpiresIn=expiration
        )
        
        # Return the presigned URL and the file ID to the client
        return {
            'statusCode': 200,
            'body': {
                'url': presigned_url,
                'file_id': file_id,  
                'file_name': file_name
            },
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
