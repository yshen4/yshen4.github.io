# CDK for Lambda

In this example, we will add:
- An AWS Lambda function.
- An Amazon API Gateway API to call the Lambda function.
- An Amazon S3 bucket that contains the Lambda function code.

## Create an CDK app

```
mkdir MyWidgetService
cd MyWidgetService
cdk init --language typescript
```
There are 2 files, one to attach the main stack to the app, the other to load stack:
- bin/my_widget_service.ts – Main entry point for the application
- lib/my_widget_service-stack.ts – Defines the widget service stack

## Add Lambda

```
mkdir resources
vi resources/widgets.ts
```
The code can be find [widgets.ts](lambda/resources/widgets.js).

## Add widget service

```
npm install @aws-cdk/aws-apigateway @aws-cdk/aws-lambda @aws-cdk/aws-s3
```
The code can be find [widget_service.ts](lambda/lib/widget_service.js).

## Link the widget service with the app

```
import * as cdk from '@aws-cdk/core';
import * as widget_service from '../lib/widget_service';

export class MyWidgetServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines widgets stack goes here
    new widget_service.WidgetService(this, 'Widgets');
  }
}
```

## Bootstrap and deploy

Before you can deploy your first AWS CDK app containing a lambda function, you must bootstrap your AWS environment. This creates a staging bucket that the AWS CDK uses to deploy stacks containing assets.

```
cdk bootstrap
cdk deploy
# cdk destroy
```

We can test all methods with curl:
```
curl -X GET 'https://GUID.execute-api-REGION.amazonaws.com/prod'
curl -X POST 'https://GUID.execute-api-REGION.amazonaws.com/prod/example'
curl -X GET 'https://GUID.execute-api-REGION.amazonaws.com/prod'
curl -X GET 'https://GUID.execute-api-REGION.amazonaws.com/prod/example'
curl -X DELETE 'https://GUID.execute-api-REGION.amazonaws.com/prod/example'
curl -X GET 'https://GUID.execute-api-REGION.amazonaws.com/prod'
```
