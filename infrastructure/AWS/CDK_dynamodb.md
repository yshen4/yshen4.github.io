# DynamoDB

This example is composed of 3 parts:
- Provisioning DynamoDB table/GSI with CDK;
- Use high level APIs to build data access layer (DAO) for DynamoDB table;
- Provisioning lambda to use the DAO to do CRUD operations on the DynamoDB table

## DynamoDB CDK

## DynamoDB Data Access

Here is an overview of DynamoDB APIs:
![DynamoDB API](/resources/img/DynamoDB.SDKInterfaces.png)


## Integration with AWS Lambda

## Reference
1. [
2. [High level DynamoDB programming with Java](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.html)
3. [Condition Expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html)
