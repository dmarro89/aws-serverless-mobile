variable "lambda_function_arn" {
  description = "ARN of the Lambda function to integrate with API Gateway"
}

variable "lambda_function_name" {
  description = "Name of the Lambda function to integrate with API Gateway"
}

resource "aws_apigatewayv2_api" "lambda" {
  name          = "serverless_lambda_gw"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id      = aws_apigatewayv2_api.lambda.id
  name        = "serverless_lambda_stage"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }
}

resource "aws_apigatewayv2_integration" "aws_serverless_terraform" {
  api_id             = aws_apigatewayv2_api.lambda.id
  integration_uri    = var.lambda_function_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

locals {
  api_integration_target = "integrations/${aws_apigatewayv2_integration.aws_serverless_terraform.id}"
}

resource "aws_apigatewayv2_route" "get_books" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "GET /books"
  target    = local.api_integration_target
}

resource "aws_apigatewayv2_route" "post_book" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "POST /books"
  target    = local.api_integration_target
}

resource "aws_apigatewayv2_route" "put_book" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "PUT /books/{id}"
  target    = local.api_integration_target
}

resource "aws_apigatewayv2_route" "get_book" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "GET /books/{id}"
  target    = local.api_integration_target
}

resource "aws_apigatewayv2_route" "delete_book" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "DELETE /books/{id}"
  target    = local.api_integration_target
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name              = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"
  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

output "base_url" {
  description = "Base URL for API Gateway stage."
  value = aws_apigatewayv2_stage.lambda.invoke_url
}