# CDK basics

AWS CloudFormation enables developers to create and provision AWS infrastructure deployments predictably and repeatedly with a template file.

However, CloudFromation template is very hard to write and maintain. AWS CDK allows developers to define reusable cloud components (constructs) in a familiar programming language, which can be composed into Stacks and Apps.

![CDK architecture](/resources/img/cdkAppStacks.png)

The AWS CDK Toolkit (cdk command-line tool) and the AWS Construct Library are developed in TypeScript and run on Node.js.

The typical workflow for creating a new app is:
- Create the app directory.
- Initialize the app.
- Add code to the app.
- Compile the app, if necessary.
- Deploy the resources defined in the app.
- Test the app.

If there are any issues, loop through modify, compile (if necessary), deploy, and test again.

## Install CDK

Prerequisites:
- node.js >= 10.3.0
- [credentials and an AWS Region to use the AWS CDK CLI](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_credentials)
- TypeScript >= 2.7

``` shell
# Upgrade npm
# npm install -g npm
npx npm-check-updates -u

# Install cdk
npm install -g aws-cdk

# Check cdk version
cdk --version
```

## Define input parameters

Use the env property on a stack to specify the account and region used when deploying a stack.

CDK recommends:
- setting those 2 parameters (region, account) in env property:
- creating all production stacks in one AWS CDK app, and deploy them as necessary

```typescript
//AccountType tuple has 3 members: [stack name, region, account]
type AccountType = [string, string, string];
let accounts: AccountType[] = [
    ['MyStack-ONE-WEST', 'us-west-2', 'ONE'], 
    ['MyStack-TWO-WEST', 'us-west-1', 'TWO'],
    ['MyStack-THREE-EAST', 'us-east-2', 'THREE'],
    ['MyStack-FOUR-EAST', 'us-east-1', 'FOUR']];

let stacks: MyStack[] = acounts.map( account => new MyStack(app, account[0], {
    env: {
        region: account[1],
        account: acount[2] 
    } 
});

// Deploy MyStack-Two-WEST, run
// cdk deploy MyStack-Two-WEST
```

## Deploy a stack

Developers must specify credentials and an AWS Region to use the AWS CDK CLI. The CDK looks for credentials and region in the following order:
- Using the --profile option to cdk commands.
- Using environment variables.
- Using the default profile as set by the AWS Command Line Interface (AWS CLI).

```shell
# Deploy MyStack-Two-WEST, run
cdk deploy MyStack-Two-WEST

# Deploy with profile
cdk deploy --profile <profile name> MyStack-Two-WEST
```

Where beta is a profile defined in AWS CLI under ~/.aws/config
```
[profile beta]
aws_access_key_id=AKIAI44QH8DHBEXAMPLE
aws_secret_access_key=je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY
region=us-west-1
```

## A quick start

### Create an app folder

```
# Create a folder
mkdir zkStack
cd zkStack
```

### Initialize the app

```
# cdk init --language LANGUAGE [TEMPLATE]
# LANGUAGE = csharp | typescript | javascript | python | java
# TEMPLATE = app (default) | sample-app
cdk init --language typescript
```

Useful commands:
- `npm run build`   compile typescript to js
- `npm run watch`   watch for changes and compile
- `npm run test`    perform the jest unit tests
- `cdk deploy`      deploy this stack to your default AWS account/region
- `cdk diff`        compare deployed stack with current state
- `cdk synth`       emits the synthesized CloudFormation template

### Compile the app

```
npm run build
```

After compilation, list the stacks in the app:
```
cdk ls

# >> ZkStackStack
```

### Add business logic

Adding an Amazon S3 bucket
- Install cdk S3

```
npm install @aws-cdk/aws-s3
``` 

- Add construct to lib/zk_stack-stack.ts

```
//...
import * as s3 from '@aws-cdk/aws-s3';

export class ZkStackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    //...
    // Add S3 bucket
    // 'zkStackBucket' is the logic name in CloudFormation, not bucket name (globally unique)
    new s3.Bucket(this, 'zkStackBucket', {
      versioned: true
    });
  }
}
```

- Compile with 'nmp run build'
- Synthesizing an AWS CloudFormation template

```
cdk synth
```

### Deploy

```
cdk deploy --profile beta
```

### Make change and update the stack

Add encryption to the S3: encryption: s3.BucketEncryption.KMS_MANAGED

```
// Compile the change
npm run build

// Check difference
cdk diff --profile beta

// Deploy again
cdk deploy --profile beta

// Destroy the stack
cdk destroy --profile beta
```

# References
\[1\] [Typescript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
