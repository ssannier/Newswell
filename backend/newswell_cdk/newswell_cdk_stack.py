
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_lambda as _lambda,
    aws_iam as iam,
    aws_apigateway as apigw,
    aws_s3_deployment as s3deploy,
    aws_logs as logs,
    Duration,
    RemovalPolicy,
)
from constructs import Construct
import os


class NewswellCdkStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs):
        super().__init__(scope, construct_id, **kwargs)

        # S3 Bucket for Data Storage
        bucketName = self.node.try_get_context("bucket_name")
        data_bucket = s3.Bucket(
            self,
            "DataBucket",
            bucket_name=bucketName,
            cors=[
                s3.CorsRule(
                    allowed_methods=[
                        s3.HttpMethods.GET,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.POST,
                    ],
                    allowed_origins=["*"],
                    allowed_headers=["*"],
                    exposed_headers=["ETag"],
                )
            ],
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
            # Setting up the bucket to automatically delete objects when the bucket is deleted
            enforce_ssl=True,
        )

        # Deploy initial data to the bucket
        s3deploy.BucketDeployment(
            self,
            "DeployDataJson",
            sources=[s3deploy.Source.asset("./data")],  # Assuming your data is in 'data' directory
            destination_bucket=data_bucket,
            destination_key_prefix="data",  # Optional prefix in S3 key
            prune=True,
        )

        # IAM Role for Lambda Functions
        lambda_role = iam.Role(
            self,
            "LambdaRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaBasicExecutionRole"
                )
            ],
        )

        # Add policies to the role
        lambda_role.add_to_policy(
            iam.PolicyStatement(
                actions=[
                    "bedrock:InvokeModel",
                    "bedrock:InvokeModelWithResponseStream",
                ],
                resources=["*"],
            )
        )

        lambda_role.add_to_policy(
            iam.PolicyStatement(
                actions=[
                    "s3:DeleteObject",
                    "s3:GetObject",
                    "s3:GetObjectVersion",
                    "s3:ListBucket",
                    "s3:PutObject",
                    "s3:PutObjectAcl",
                ],
                resources=[data_bucket.bucket_arn, f"{data_bucket.bucket_arn}/*"],
            )
        )

        # Common Lambda Function Properties
        lambda_kwargs = {
            "runtime": _lambda.Runtime.PYTHON_3_12,
            "environment": {
                "BUCKET_NAME": data_bucket.bucket_name,
                "REGION_NAME": self.region,
            },
            "role": lambda_role,
            "timeout": Duration.minutes(10),
        }

        # Lambda Functions
        summary_lambda = _lambda.Function(
            self,
            "SummaryLambda",
            code=_lambda.Code.from_asset("lambda_functions/summary_lambda"),
            handler="summary_lambda.lambda_handler",
            **lambda_kwargs,
        )

        title_lambda = _lambda.Function(
            self,
            "TitleLambda",
            code=_lambda.Code.from_asset("lambda_functions/title_lambda"),
            handler="title_lambda.lambda_handler",
            **lambda_kwargs,
        )

        update_data_lambda = _lambda.Function(
            self,
            "UpdateDataLambda",
            code=_lambda.Code.from_asset("lambda_functions/update_data_lambda"),
            handler="update_data_lambda.lambda_handler",
            **lambda_kwargs,
        )

        get_data_lambda = _lambda.Function(
            self,
            "GetDataLambda",
            code=_lambda.Code.from_asset("lambda_functions/get_data_lambda"),
            handler="get_data_lambda.lambda_handler",
            **lambda_kwargs,
        )

        generate_presigned_url_new_lambda = _lambda.Function(
            self,
            "GeneratePresignedUrlNewLambda",
            code=_lambda.Code.from_asset("lambda_functions/generate_presigned_url_new"),
            handler="generate_presigned_url_new.lambda_handler",
            **lambda_kwargs,
        )

        generate_presigned_url_existing_lambda = _lambda.Function(
            self,
            "GeneratePresignedUrlExistingLambda",
            code=_lambda.Code.from_asset("lambda_functions/generate_presigned_url_existing"),
            handler="generate_presigned_url_existing.lambda_handler",
            **lambda_kwargs,
        )

        get_presigned_url_lambda = _lambda.Function(
            self,
            "GetPresignedUrlLambda",
            code=_lambda.Code.from_asset("lambda_functions/get_presigned_url"),
            handler="get_presigned_url.lambda_handler",
            **lambda_kwargs
        )

        idml_layer = _lambda.LayerVersion(
            self, 'idmlLayer',
            layer_version_name='idml_layer_1',
            code=_lambda.Code.from_asset('lambda_layers/idml_layer'),  # Path to the layer code
            compatible_runtimes=[_lambda.Runtime.PYTHON_3_12],  
            description="A lambda layer with IDML dependencies"
        )

        lxml_layer = _lambda.LayerVersion(
            self, 'lxmlLayer',
            layer_version_name='lxml_layer_1',
            code=_lambda.Code.from_asset('lambda_layers/lxml_layer'),  # Path to the layer code
            compatible_runtimes=[_lambda.Runtime.PYTHON_3_12],  
            description="A Lambda layer with lxml dependencies"
        )

        translation_layer = _lambda.Function(
            self, 'TranslationFunctionv2', 
            code=_lambda.Code.from_asset('lambda_functions/translationLayer'), 
            handler='translate.lambda_handler',
            layers=[idml_layer, lxml_layer],  # Lambda layer here
            **lambda_kwargs
        )

        # API Gateway
        api = apigw.RestApi(
            self,
            "NewswellApi",
            rest_api_name="Newswell Service",
            description="This service serves Newswell APIs.",
            deploy_options=apigw.StageOptions(
                stage_name="prod",
                logging_level=apigw.MethodLoggingLevel.OFF,
                data_trace_enabled=False,
            ),
        )

        # /summary POST
        summary_resource = api.root.add_resource("summary")
        summary_integration = apigw.LambdaIntegration(summary_lambda)
        summary_resource.add_method("POST", summary_integration)

        # /title POST
        title_resource = api.root.add_resource("title")
        title_integration = apigw.LambdaIntegration(title_lambda)
        title_resource.add_method("POST", title_integration)

        # /update_data POST
        update_data_resource = api.root.add_resource("update_data")
        update_data_integration = apigw.LambdaIntegration(update_data_lambda)
        update_data_resource.add_method("POST", update_data_integration)

        # /get_data GET
        get_data_resource = api.root.add_resource("get_data")
        get_data_integration = apigw.LambdaIntegration(get_data_lambda)
        get_data_resource.add_method("GET", get_data_integration)

        # /generate_presigned_url_new GET
        generate_presigned_url_new_resource = api.root.add_resource(
            "generate_presigned_url_new"
        )
        generate_presigned_url_new_integration = apigw.LambdaIntegration(
            generate_presigned_url_new_lambda
        )
        generate_presigned_url_new_resource.add_method(
            "GET", generate_presigned_url_new_integration
        )

        # /generate_presigned_url_existing GET
        generate_presigned_url_existing_resource = api.root.add_resource(
            "generate_presigned_url_existing"
        )
        generate_presigned_url_existing_integration = apigw.LambdaIntegration(
            generate_presigned_url_existing_lambda
        )
        generate_presigned_url_existing_resource.add_method(
            "GET", generate_presigned_url_existing_integration
        )

        # /get_presigned_url GET
        get_presigned_url_resource = api.root.add_resource("get_presigned_url")
        get_presigned_url_integration = apigw.LambdaIntegration(
            get_presigned_url_lambda
        )
        get_presigned_url_resource.add_method("POST", get_presigned_url_integration)

        # /
        idml_gen_resource = api.root.add_resource("idml_gen")
        idml_integration = apigw.LambdaIntegration(translation_layer)
        idml_gen_resource.add_method("GET", idml_integration)

        # Outputs
        self.api_endpoint = api.url

