resource "aws_iam_role" "combined_lambda_role" {
  name = "combined_lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Sid       = ""
        Principal = { Service = "lambda.amazonaws.com" }
      },
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Sid       = ""
        Principal = { Service = "apigateway.amazonaws.com" }
      },
    ]
  })
}

resource "aws_iam_policy" "combined_lambda_policy" {
  name        = "combined_lambda_policy"
  description = "Policy for Lambda to access DynamoDB and other resources"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem", "dynamodb:Scan", "dynamodb:Query"]
        Resource = "arn:aws:dynamodb:*:237261645877:table/BOOKS"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "combined_lambda_attachment" {
  policy_arn = aws_iam_policy.combined_lambda_policy.arn
  role       = aws_iam_role.combined_lambda_role.name
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.combined_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

output "iam_roles_arn" {
  description = "ARN Role"
  value = aws_iam_role.combined_lambda_role.arn
}
