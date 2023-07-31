# AWS Serverless Mobile
AWS Serverless Mobile is a cloud-native application that enables easy cloud infrastructure deployment on Amazon Web Services (AWS) using a serverless microservices architecture. This project showcases how to create and manage AWS infrastructure via a simple Terraform code, and utilize serverless technologies such as AWS Lambda and API Gateway to expose CRUD Rest API. The backend is entirely written in typescript.
The API deployed on AWS are consumed by a React-Native mobile application with a simple but efficient interface.

## Features

- **Serverless Microservices Architecture**: The serverless microservices architecture follows the AWS best practices. Leverage AWS Lambda, API Gateway, and other serverless services to build scalable and maintainable applications.
- **Terraform Infrastructure**: Easily create and manage the required AWS infrastructure using Terraform. Just configure your AWS credentials, and Terraform will handle the rest, providing a streamlined infrastructure setup process.
- **AWS API Gateway**: Easily expose APIs through AWS API Gateway for secure and managed access to your microservices.
- **AWS Lambda Functions**: Implement serverless backend functionality using AWS Lambda functions. Benefit from auto-scaling and pay-as-you-go pricing, eliminating the need to manage server infrastructure.
- **DynamoDB Integration**: Store and retrieve data seamlessly with DynamoDB, Amazon's fully managed NoSQL database. DynamoDB provides high scalability, low latency, and automatic scaling, making it a perfect fit for your serverless architecture.
- **TypeScript Backend**: The backend logic is implemented in TypeScript, providing a statically-typed and maintainable codebase.
- **React Native Mobile App**: Interact with your AWS resources via a user-friendly React Native mobile application, available on both iOS and Android.

## Installation

Follow these steps to set up and run AWS Serverless Mobile on your local machine:
1. **Prerequisites**: Ensure you have Terraform, Node.js and npm installed on your system.

2. **Clone the Repository**: Use Git to clone this repository to your local machine:
```
git clone https://github.com/dmarro89/aws-serverless-mobile.git
cd aws-serverless-mobile
```

3. **Install Dependencies and build the project**: Navigate to the typescript project under the `lambda` folder, install the required dependencies using `yarn` and build the project (ensure to have `tsc` installed):
```
cd lambda && yarn install && yarn build && cd ..
```

4. **Configure AWS Credentials**: Duplicate the file `./terraform/.aws/creds.example` and rename it to `./terraform/.aws/creds`.
```
cp ./terraform/.aws/creds.example ./terraform/.aws/.creds
```

4.1. **Configure AWS Credentials**: Now, open the `.creds` file and replace the placeholders with your AWS Access Key ID and Secret Access Key to enable access to your AWS resources.

5. **Create Infrastructure with Terraform**: Use Terraform to easily create the required AWS infrastructure.
```
cd terraform && terraform init
terraform apply
cd ..
```
Terraform will print a `base_url` value as the results of the terraform apply.

6. **Configure Mobile App Environment Variables**: Duplicate the file `./mobile/env.example` and rename it to `./mobile/.env`. 
```
cd mobile
cp ./env.example ./.env
```

6.1. **Configure Mobile App Environment Variables**: Now, open the `.env` file with a text editor and replace the placeholder for `EXPO_PUBLIC_API_GATEWAY_URL` with the value extracted from the `base_url` Terraform output.

7. **Start the Mobile App**:
- **Install Dependencies**: Install the dependencies:
  ```
  yarn install
  ```
- **iOS**: Run the following command to start the React Native mobile app on an iOS simulator or device:
  ```
  yarn ios
  ```
- **Android**: Run the following command to start the React Native mobile app on an Android emulator or device:
  ```
  yarn android
  ```





