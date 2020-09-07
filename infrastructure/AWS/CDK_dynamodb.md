# DynamoDB

This example is composed of 3 parts:
- Provisioning DynamoDB table/GSI with CDK;
- Use high level APIs to build data access layer (DAO) for DynamoDB table;
- Provisioning lambda to use the DAO to do CRUD operations on the DynamoDB table

## DynamoDB CDK

To define a DynamoDB table:

```
private createSnsTopicTable(tableName: string) {
    const snsTopicTable = new Table(this, tableName, {
      tableName: tableName,
      partitionKey: {
        name: 'taskId',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'userId',
        type: AttributeType.STRING
      },
      timeToLiveAttribute: 'ttl',
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    snsTopicTable.addGlobalSecondaryIndex({
      indexName: `activityByGroupIndex`,
      partitionKey: {
        name: "groupId",
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'eventTime',
        type: AttributeType.NUMBER
      },
      projectionType: ProjectionType.ALL
    });
}
```

to define role and lambda to access DynamoDB table: 

```
private createSnsTopicIngestionLambda(lambdaName: string,
                                      lamdbaHandler: string,
                                      snsTopicQueue: sqs.Queue,
                                      snsTopicTable: Table) {
    const snsTopicIngestionLambdaRole = new Role(this, `${lambdaName}Role`, {
      roleName: `${lambdaName}IngestionRole`,
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
      inlinePolicies: {
        'SnsTopicQueueAccessPolicy': new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['sqs:receieveMessage'],
              effect: Effect.ALLOW,
              resources: [snsTopicQueue.queueArn]
            })
          ]
        }),
        'SnsTopicTableAccessPolicy': new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: [
                  'dynamodb:ConditionCheckItem',
                  'dynamodb:PutItem',
                  'dynamodb:UpdateItem',
                  'dynamodb:DeleteItem',
                  'dynamodb:GetItem'
              ],
              effect: Effect.ALLOW,
              resources: [snsTopicTable.tableArn]
            })
          ]
        })
      }
    });

    const snsTopicIngestionLambda = new Function(this, lambdaName, {
      functionName: lambdaName,
      runtime: Runtime.JAVA_8,
      handler: lamdbaHandler,
      code: lambda.Code.asset("path/to/artifact"),
      timeout: Duration.seconds(30),
      memorySize: 256,
      role: snsTopicIngestionLambdaRole,
      events: [new SqsEventSource(snsTopicQueue, { batchSize: 10 })],
      environment: {
        'SNS_TOPIC_TABLE': snsTopicTable.tableName
      }
    });

    return snsTopicIngestionLambda;
  }
```

## DynamoDB Data Access

Here is an overview of DynamoDB APIs:
![DynamoDB API](/resources/img/DynamoDB.SDKInterfaces.png)


## Integration with AWS Lambda

## Reference
2. [High level DynamoDB programming with Java](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.html)
3. [Condition Expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html)
