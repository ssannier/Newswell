import boto3
import json
import os

s3 = boto3.client('s3')
BUCKET_NAME = os.getenv('BUCKET_NAME')
FILE_FOLDER = 'data/'
FILE_NAME = 'data.json'

def lambda_handler(event, context):
    try:
        file_key = FILE_FOLDER + FILE_NAME
        
        
        # Parse the JSON data from the request body
        if 'body' in event and event['body']:
            # If there's a 'body', it's a string, so we parse it as JSON
            json_data = json.loads(event['body'])
        else:
            # If no 'body' field, assume the event itself is the JSON data
            json_data = event

        # Save the JSON data to S3
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=file_key,
            Body=json.dumps(json_data),
            ContentType='application/json'
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'JSON updated successfully'}),
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
