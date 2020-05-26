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

# Install typescript 
npm install -g typescript

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

## Concepts

### Construct

Constructs are the basic building blocks of AWS CDK apps. A construct represents a "cloud component" and encapsulates everything AWS CloudFormation needs to create the component.

A construct can represent a single resource, such as an Amazon Simple Storage Service (Amazon S3) bucket, or it can represent a higher-level component consisting of multiple AWS CDK resources.

#### AWS Construct library

AWS Construct Library contains constructs representing AWS resources. There are 3 levels of AWS constructs
- Low level construct: CFN Resources, which include all of the AWS resources that are available in AWS CloudFormation. They are named CfnXyz, where Xyz represents the name of the resource. For example, s3.CfnBucket represents the AWS::S3::Bucket CFN Resource.
- Middle level construct: represent AWS resources, but with a higher-level, intent-based API, which handle much of the details, boilerplate, and glue logic required by CFN constructs. For example, the s3.Bucket class represents an Amazon S3 bucket with additional properties and methods, such as bucket.addLifeCycleRule(), which adds a lifecycle rule to the bucket.
- High level contruct: patterns. These constructs are designed to help you complete common tasks in AWS, often involving multiple kinds of resources. For example, the aws-ecs-patterns.ApplicationLoadBalancedFargateService construct represents an architecture that includes an AWS Fargate container cluster employing an Application Load Balancer (ALB)

#### Composition

The key pattern for defining higher-level abstractions through constructs is called composition. 

A high-level construct can be composed from a number of lower-level constructs, and in turn, those could be composed from even lower-level constructs. To enable this pattern, constructs are always defined within the scope of another construct. This scoping pattern results in a hierarchy of constructs known as a construct tree. 

In the AWS CDK, the root of the tree represents the entire AWS CDK app. Within the app, you typically define one or more stacks, which are the unit of deployment, analogous to AWS CloudFormation stacks. Within stacks, you define resources, or other constructs that eventually contain resources.

#### Initialization

All contructs extends cdk.Contruct base class, which takes 3 parameters:
- Scope – The construct within which this construct is defined
- id – An identifier that must be unique within this scope
- Props – A set of properties or keyword arguments that define the construct's initial configuration

#### Apps and Stacks

CDK application (app) extends the AWS CDK class App. CDK Stacks in AWS CDK apps extend the Stack base class. Using import keyword to load dependent constructs into the module. 

```
import { App, Stack, StackProps } from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

class HelloCdkStack extends Stack {
  //A stack has a scope of app
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // A contruct has a scope of stack
    new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true
    });
  }
}

const app = new App();
new HelloCdkStack(app, "HelloCdkStack");
```

#### Configuration (props)

Contruct accept props as the third argument which is a name/value collection that defines the construct's configuration.

```
new s3.Bucket(this, 'MyEncryptedBucket', {
  encryption: s3.BucketEncryption.KMS,
  websiteIndexDocument: 'index.html'
});
```

#### Interact with contruct instances

Constructs are classes that extend the base Construct class. After you instantiate a construct, the construct object exposes a set of methods and properties that enable you to interact with the construct and pass it around as a reference to other parts of the system.

```
// Define the S3 bucket
const rawData = new s3.Bucket(this, 'raw-data');

// Define the IAM group
const dataScience = new iam.Group(this, 'data-science');

// Grant the READ permission for rawData to dataScience group 
rawData.grantRead(dataScience);
```

Another common pattern is for AWS constructs to set one of the resource's attributes, such as its Amazon Resource Name (ARN), name, or URL from data supplied elsewhere:

```
const jobsQueue = new sqs.Queue(this, 'jobs');
const createJobLambda = new lambda.Function(this, 'create-job', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset('./create-job-lambda-code'),
  environment: {
    QUEUE_URL: jobsQueue.queueUrl
  }
});
```

#### Author contructs

A contruct creates S3 bucket and SNS topic such that writing to S3 triggers SNS event to the topic.

Export both the interface and class for external use

```
// Declare props type interface, which specify S3 prefix
export interface NotifyingBucketProps {
  prefix?: string;
}

// this class take NotifyingBucketProps as input
export class NotifyingBucket extends Construct {
  // Expose the topic for external use: subscribe/unsubscribe
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string, props: NotifyingBucketProps = {}) {
    super(scope, id);
    const bucket = new s3.Bucket(this, 'bucket');
    this.topic = new sns.Topic(this, 'topic');
    bucket.addObjectCreatedNotification(new s3notify.SnsDestination(topic),
      { prefix: props.prefix });
  }
}

// Use the NotifyingBucket defined above
const queue = new sqs.Queue(this, 'NewImagesQueue');
const imageBucket = new NotifyingBucket(this, 'ImageBucket', { prefix: 'images/' );
imageBucket.topic.addSubscription(new sns_sub.SqsSubscription(queue));
```

### Stacks

The unit of deployment in the AWS CDK is called a stack. All AWS resources defined within the scope of a stack, either directly or indirectly, are provisioned as a single unit.

```
import { App, Construct, Stack } from "@aws-cdk/core";

interface EnvProps {
  prod: boolean;
}

// imagine these stacks declare a bunch of related resources
class ControlPlane extends Stack {}
class DataPlane extends Stack {}
class Monitoring extends Stack {}

class MyService extends Construct {
  constructor(scope: Construct, id: string, props?: EnvProps) {
    super(scope, id);
  
    // we might use the prod argument to change how the service is configured
    new ControlPlane(this, "cp");
    new DataPlane(this, "data");
    new Monitoring(this, "mon");  }
}

const app = new App();
new MyService(app, "beta");
new MyService(app, "prod", { prod: true });

app.synth();
```

### Apps

App goes through 5 phases when calling cdk deploy:
- Construct: call CDK app code to instantiate and link all contructs
- Prepare: run contruct.prepare methods to set final states
- Validate: validate all constructs can be deployed without problem 
- Synthesize: call app.synth(), and it traverses the construct tree and invokes the synthesize method on all constructs
- Deploy: AWS CDK CLI takes the deployment artifacts cloud assembly produced by the synthesis phase and deploys it to an AWS environment.

![CDK App lifecyle](/resources/img/cdkAppLifecycle.png)

## References
[1] [Typescript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
[2] [Working with CDK Typscript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html)
