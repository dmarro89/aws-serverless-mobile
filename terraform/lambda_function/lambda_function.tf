variable "role_arn" {
  description = "ARN Role of the Lambda function to integrate with API Gateway"
}

resource "random_pet" "lambda_bucket_name" {
  prefix = "aws-serverless-terraform"
  length = 4
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id
}

resource "aws_lambda_function" "aws-serverless-terraform" {
  function_name = "AWSServerlessTerraform"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.aws-serverless-terraform.key

  runtime = "nodejs18.x"
  handler = "handler.handler"

  source_code_hash = data.archive_file.aws-serverless-terraform.output_base64sha256

  role = var.role_arn
}

data "archive_file" "aws-serverless-terraform" {
  type = "zip"

  source_dir  = "${path.module}/../../lambda/dist"
  output_path = "${path.module}/../../lambda/aws-serverless-terraform.zip"
}

resource "aws_s3_object" "aws-serverless-terraform" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "aws-serverless-terraform.zip"
  source = data.archive_file.aws-serverless-terraform.output_path

  etag = filemd5(data.archive_file.aws-serverless-terraform.output_path)
}

resource "aws_cloudwatch_log_group" "aws-serverless-terraform" {
  name              = "/aws/lambda/${aws_lambda_function.aws-serverless-terraform.function_name}"
  retention_in_days = 30
}

output "function_name" {
  description = "Name of the Lambda function."
  value = aws_lambda_function.aws-serverless-terraform.function_name
}

output "lambda_function_arn" {
  value = aws_lambda_function.aws-serverless-terraform.arn
}

output "lambda_function_name" {
  value = aws_lambda_function.aws-serverless-terraform.function_name
}