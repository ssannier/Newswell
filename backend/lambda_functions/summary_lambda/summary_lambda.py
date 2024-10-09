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
        print(response_text)
        return response_text.strip()
        
    except (ClientError, Exception) as e:
        print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
        raise e

def construct_prompt(content, max_length, editor_message=None):
    prompt = f"Summarize the following content in less than {max_length} characters and make sure the output is not exceeding the character count. Follow these rules: 1) The summary must include all key points, 2) It must be less than {max_length} characters, (including spaces and punctuation), 3) Avoid truncating words; rephrase to fit the character count less than the {max_length}, 4) Ensure proper grammar and punctuation, 5) Use AP style throughout, 6) No headings or extra information beyond the summary. The output must be concise, precise, and less than {max_length} characters."
    if editor_message:
        prompt += f" Follow the editor's message: {editor_message}"
    prompt += f"\n\nContent: {content}"
    return prompt

def lambda_handler(event, context):
    try:
        print(event)
        body = json.dumps(event)
        body = json.loads(body)
        content = body['content']
        # max_length = body['length']
        max_length = int(body['length'])-10
        # if(body['editor_message']):
        #     editor_message = body['editor_message']
        # else:
        #     editor_message = None
        editor_message = body.get('editor_message')
        
        if not content:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Content is required'}),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'  # Allowed methods
                }

            }
        
        prompt = construct_prompt(content, max_length, editor_message)
        response_text = invoke_bedrock_model(prompt, max_length)
        
        return {
            'statusCode': 200,
            'body': response_text,
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
