import boto3
import json
import os

s3 = boto3.client('s3')

BUCKET_NAME = os.getenv('BUCKET_NAME')
FILE_FOLDER = 'data/'
FILE_NAME = 'data.json'

def lambda_handler(event, context):
    try:
        # Check if headers exist in the event object

        # The full S3 key for the JSON file
        file_key = FILE_FOLDER + FILE_NAME
    
        print(file_key, BUCKET_NAME)
        # Retrieve the JSON file from S3
        response = s3.get_object(
            Bucket=BUCKET_NAME,
            Key=file_key
        )
        
        # Read the JSON data
        print(response)
        json_data = response['Body'].read().decode('utf-8')
        parsed_data = json.loads(json_data)

        return {
            'body': json.dumps(parsed_data),
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'  # Allowed methods
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
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'  # Allowed methods
                }
        }