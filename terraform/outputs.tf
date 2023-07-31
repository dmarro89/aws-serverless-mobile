output "function_name" {
  description = "Name of the Lambda function."

  value = module.lambda_function.function_name
}

output "base_url" {
  description = "Base URL for API Gateway stage."

  value = module.api_gateway.base_url
}
