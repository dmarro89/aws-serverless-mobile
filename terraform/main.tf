terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region                   = var.aws_region
  shared_credentials_files = ["./.aws/creds"]
}

module "iam_roles" {
  source = "./iam_roles"
}

module "lambda_function" {
  source = "./lambda_function"
  role_arn = module.iam_roles.iam_roles_arn
}

module "api_gateway" {
  source = "./api_gateway"
  lambda_function_arn = module.lambda_function.lambda_function_arn
  lambda_function_name = module.lambda_function.lambda_function_name
}

resource "aws_dynamodb_table" "books_table" {
  name           = "BOOKS"
  read_capacity  = "30"
  write_capacity = "30"
  attribute {
    name = "id"
    type = "N"
  }
  hash_key = "id"
}