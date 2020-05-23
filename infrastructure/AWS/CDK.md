# CDK basics

AWS CloudFormation enables developers to create and provision AWS infrastructure deployments predictably and repeatedly with a template file.

However, CloudFromation template is very hard to write and maintain. AWS CDK allows developers to define reusable cloud components (constructs) in a familiar programming language, which can be composed into Stacks and Apps.

![CDK architecture](/resources/img/cdkAppStacks.png)

The AWS CDK Toolkit (cdk command-line tool) and the AWS Construct Library are developed in TypeScript and run on Node.js.

## Prerequisites
- node.js >= 10.3.0
- [credentials and an AWS Region to use the AWS CDK CLI](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_credentials)
- TypeScript >= 2.7

### Install CDK

``` shell
# Upgrade nmp
npm install -g npm

# Install cdk
npm install -g aws-cdk

# Check cdk version
cdk --version
```
