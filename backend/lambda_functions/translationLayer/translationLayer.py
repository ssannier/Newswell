from lxml import etree
from simple_idml import idml, utils
import json
import boto3
import logging
import os

logger = logging.getLogger(__name__)
BUCKET_NAME = os.getenv('BUCKET_NAME')
# Create an S3 client
s3 = boto3.client('s3', region_name='us-east-1')

def mapping_fn(my_idml):
    tree_var_contentr = my_idml.export_as_tree()

    tree_var_content = tree_var_contentr['content']
    logger.debug(tree_var_content)
    
    
    layout_json_bucket_name = BUCKET_NAME
    layout_json_file_key = f'data/data.json'
    
    try:
        # Block to read JSON and map the JSON to the XML Structure
        s3.download_file(Bucket=layout_json_bucket_name, Key=layout_json_file_key, Filename = '/tmp/layout.json')
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Failed to download the file from S3.', 'error': str(e)}),
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'  # Allowed methods
                }
        }
    
    with open('/tmp/layout.json', 'r') as f:
        data = json.load(f)

        #Put all json data into a list of tuples where key and value exist
        json_data_modified = [(key, value) for key, value in data.items()]
        logger.debug(json_data_modified)

        mapping_rules = [
        ('banner', 0),  # Maps to the first Story element (banner or masthead)
        ('price_country', 4),  # Combines price, country, date, etc., for a single Story element
        ('bannerSubtitle', 5),  # A subtitle for the banner
        ('row1_1', 7),  # First row content (story)
        ('row1_2', 8),  # Second row content (story)
        ('row1_3', 9),
        ('row2_image_title', 14),
        ('row2_title', 13),
        ('mediaAddress', 11),  # Third row content (story)
        ('row2', 12),  # Maps to the content in row 2 (e.g., major story with image)
        ('row3', 17),
        ('row3_title', 19),  # Maps to the content in row 3
        ('row4', 18),
        ('row4_title', 24),
        ('col1_title', 26),  # Maps to the content in row 4
        ('col1', 25),
        ('culture_text', 21),
        # Maps to the content in col1 (for sidebar or column)
        ('row2_image', 31),
        ('row3_image', 32),
        ('col1_image', 34),
        ('row4_image', 33),
        ('row1_1_image', 35),
        ('row1_2_image', 36),
        ('row1_3_image', 37),
        ('row0_image', 38)
    ]
    
    # Helper function to combine data for price, country, day, etc.
    def format_issue_info(json_data_modified):
        return f"\n{json_data_modified.get('price', '')} \n{json_data_modified.get('country', '')} \n{json_data_modified.get('day', '')} \n{json_data_modified.get('date', '')} \nIssue No: {json_data_modified.get('issueNumber', '')}"

    # Prepare the JSON mapping (in case some fields are missing, default to empty)
    json_mapping = {
        'banner': data.get('banner', ''),
        'price_country': format_issue_info(data),
        'culture_text': 'CULTURE',
        'bannerSubtitle': data.get('bannerSubtitle', ''),
        'mediaAddress': f"\{data.get('mediaAddress', '')}",
        'row1_1': f"\n{data.get('row1_1', {}).get('body', '')}",
        'row1_1_image': 'file:///archive/' + data.get('row1_1', {}).get('id', '') + '.jpg',
        'row1_2': f"\n{data.get('row1_2', {}).get('body', '')}",
        'row1_2_image': 'file:///archive/' + data.get('row1_2', {}).get('id', '') + '.jpg',
        'row1_3': f"\n{data.get('row1_3', {}).get('body', '')}",
        'row1_3_image': 'file:///archive/' + data.get('row1_3', {}).get('id', '') + '.jpg',
        'row2_title': data.get('row2', {}).get('title', ''),
        'row2_image_title': data.get('row2', {}).get('imageSubtitle', ''),
        'row2': f"\n{data.get('row2', {}).get('author', '')} | \n{data.get('row2', {}).get('body', '')}",
        'row2_image': 'file:///archive/' + data.get('row2', {}).get('id', '') + '.jpg',
        'row3': f"\n{data.get('row3', {}).get('author', '')} | \n{data.get('row3', {}).get('body', '')}",
        'row3_image': 'file:///archive/' + data.get('row3', {}).get('id', '') + '.jpg',
        'col1_image': 'file:///archive/' + data.get('col1', {}).get('id', '') + '.jpg',
        'row3_title': f"{data.get('row3', {}).get('title', '')}",
        'row4': f"\n{data.get('row4', {}).get('author', '')} | \n{data.get('row4', {}).get('body', '')}",
        'row4_image': 'file:///archive/' + data.get('row4', {}).get('id', '') + '.jpg',
        'row4_title': f"{data.get('row4', {}).get('title', '')}",
        'col1_title': f"{data.get('col1', {}).get('title', '')}",
        'col1': f"\n{data.get('col1', {}).get('body', '')}",
        'row0_image': 'file:///archive/' + data.get('qrCode', {}) + '.jpg'
    }

    # Iterate through the XML structure and apply updates
    try:
        for pos, entry in enumerate(tree_var_content):
            for key, map_pos in mapping_rules:
                if map_pos == pos:
                    content = json_mapping.get(key, '')
                    if entry['tag'] == 'Story':
                        entry['content'] = [content] if content else entry['content']  # Update content if available
                        break
                    elif entry['tag'] == 'Image':
                        entry['attrs']['href'] = content if content else entry['attrs']['href']
                        break
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Mapping Failure', 'error': str(e)}),
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'  # Allowed methods
                }
        }
    tree_var_contentr['content'] = tree_var_content
    return tree_var_contentr

def lambda_handler(event, context):
    
    IDML_layout_bucket_name = 'newswell'
    IDML_layout_file_key = f'Front page with tags.idml'

    # Try to download the text file from S3
    try:
        s3.download_file(Bucket=IDML_layout_bucket_name, Key=IDML_layout_file_key, Filename = '/tmp/layout_file.idml')
        my_idml = idml.IDMLPackage("/tmp/layout_file.idml")
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Failed to download the file from S3.', 'error': str(e)}),
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'  # Allowed methods
                }
        }
    
    tree_var_contentr = mapping_fn(my_idml)
    
    # Block to save the file
    try:
        dom = utils.tree_to_etree_dom(tree_var_contentr)
    
        final_xml_form = etree.tostring(dom, encoding=None, pretty_print=True).decode("utf-8")
    
        with open("/tmp/output.xml", "w") as f:
            f.write(final_xml_form)
    
        my_idml.import_xml(final_xml_form, "/Root")
        my_idml.close()
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'XML Conversion Failure', 'error': str(e)}),
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'  # Allowed methods
                }
        }
        
    try:
        s3.upload_file("/tmp/layout_file.idml", 'newswell', 'Output_idml.idml')
        presigned_url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': 'newswell', 'Key': 'Output_idml.idml'},
                ExpiresIn=21600  # URL expiration time in seconds
            )
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'S3 upload and presigned_url Failure', 'error': str(e)}),
            'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'  # Allowed methods
                }
        }

    return {
        'statusCode': 200,
        's3_presigned_url': json.dumps(presigned_url),
        'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'  # Allowed methods
                }
    }