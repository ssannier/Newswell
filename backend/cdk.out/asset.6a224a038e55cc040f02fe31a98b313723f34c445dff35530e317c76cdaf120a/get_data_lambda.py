import boto3
import json

s3 = boto3.client('s3')
BUCKET_NAME = 'samplenewswell1'
FILE_FOLDER = 'file/'
FILE_NAME = 'data.json'

def lambda_handler(event, context):
    try:
        # Check if headers exist in the event object

        # The full S3 key for the JSON file
        file_key = FILE_FOLDER + FILE_NAME
    
    
        # Retrieve the JSON file from S3
        response = s3.get_object(
            Bucket=BUCKET_NAME,
            Key=file_key
        )
        
        # Read the JSON data
        json_data = response['Body'].read().decode('utf-8')

        return {
            'body': json.loads(json_data),
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
            'body': json.dumps({'error': str(e)}),
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'  # Allowed methods
                }
        }