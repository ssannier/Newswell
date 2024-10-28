import json
import boto3
from botocore.exceptions import ClientError

s3 = boto3.client('s3')
bedrock_client = boto3.client('bedrock-runtime', region_name='us-east-1')

def invoke_bedrock_model(prompt, max_length):
    model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    native_request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_length,
        "temperature": 0.5,
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": prompt}],
            }
        ],
    }
    request = json.dumps(native_request)
    try:
        response = bedrock_client.invoke_model(modelId=model_id, body=request)
        model_response = json.loads(response["body"].read())
        response_text = model_response["content"][0]["text"]
        return response_text
        
    except (ClientError, Exception) as e:
        print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
        raise e

def construct_prompt(content, max_length, editor_message=None):
    prompt = f"Generate a single, catchy, and relevant title for the following content, in less than {max_length} characters. Follow these rules: 1) Include key points, 2) Less than {max_length} characters (including spaces), 3) No truncation; rephrase if necessary, 4) Ensure proper grammar and punctuation, 5) Use AP style throughout. Output must be concise and precise."
    if editor_message:
        prompt += f" Follow the editor's message: {editor_message}"
    prompt += f"\n\nContent: {content}"
    return prompt

def lambda_handler(event, context):
    response_text = None  # Initialize response_text
    try:
        if 'body' in event:
            event_body = json.loads(event['body'])  # Parse the body string
        else:
            event_body = event  # If directly from Lambda test, it will not be stringified
        
        content = event_body.get('content')
        max_length = event_body.get('length')
        editor_message = event_body.get('editor_message')
        
        if not content:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Content is required'}),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                }
            }
        
        prompt = construct_prompt(content, max_length, editor_message)
        response_text = invoke_bedrock_model(prompt, max_length)
        
        return {
            'statusCode': 200,
            'body': json.dumps({'response': response_text}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            }
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),  # Use the exception message
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            }
        }
