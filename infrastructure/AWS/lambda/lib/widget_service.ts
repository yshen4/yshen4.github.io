import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";

export class WidgetService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    //Define S3 bucket
    const bucket = new s3.Bucket(this, "WidgetStore");

    //Define Lambda function
    const handler = new lambda.Function(this, "WidgetHandler", {
      runtime: lambda.Runtime.NODEJS_10_X, // So we can use async in widget.js
      code: lambda.Code.asset("resources"),
      handler: "widgets.main",
      environment: {
        BUCKET: bucket.bucketName
      }
    });

    //Grant permission for bucket to handler
    bucket.grantReadWrite(handler); // was: handler.role);

    //Define API gateway
    const api = new apigateway.RestApi(this, "widgets-api", {
      restApiName: "Widget Service",
      description: "This service serves widgets."
    });

    // Get all widgets from bucket with: GET /
    const getAllWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });
    api.root.addMethod("GET", getAllWidgetsIntegration); // GET /

    // Add new widget to bucket with {id}
    const widget = api.root.addResource("{id}");

    // Add new widget to bucket with: POST /{id}
    const postWidgetIntegration = new apigateway.LambdaIntegration(handler);
    widget.addMethod("POST", postWidgetIntegration); // POST /{id}

    // Get a specific widget from bucket with: GET /{id}
    const getWidgetIntegration = new apigateway.LambdaIntegration(handler);
    widget.addMethod("GET", getWidgetIntegration); // GET /{id}

    // Remove a specific widget from the bucket with: DELETE /{id}
    const deleteWidgetIntegration = new apigateway.LambdaIntegration(handler);
    widget.addMethod("DELETE", deleteWidgetIntegration); // DELETE /{id}
  }
}
