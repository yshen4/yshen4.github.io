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

### Environments

Each Stack instance in AWS CDK app is explicitly or implicitly associated with an environment (env). 
- An environment is the target AWS account and AWS Region into which the stack is intended to be deployed.

If not specified, it will use deploy time resolution on environment-related attributes such as stack.account, stack.region, and stack.availablityZones. Usually it uses specified AWS CLI profile to determine those parameters.

```
const envUSA = { account: '8373873873', region: 'us-west-2' };

// It will always be deployed to envUSA
new MyStackUSWEST(app, 'first-stack-us', { env: envUSA });

// To avoid hardcoding env, stacks can use two environment variables provided by the AWS CDK CLI: CDK_DEFAULT_ACCOUNT and CDK_DEFAULT_REGION. 
// These variables are set based on the AWS profile specified using the --profile option, 
// or the default AWS profile if you don't specify one
// This option is desirable in development, but anti-pattern in production.
new MyStackFromProfile(app, 'stack-profiled', { 
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
}});
```

### Resources

All AWS resources are represented with constructs.

- Resources have attributes which can be called with the instances in runtime:  
  - myQueue.queueUrl (in cloudformation, "Ref" : "myQueue")
  - myQueue.queueArn (in cloudformation, "Fn::GetAtt" : ["myQueue", "ARN"])
- Resources can be referenced with 2 options:
  - By passing the resource directly
  - By passing the resource's unique identifier (ARN, ID or a name)
- Accessing resources in a different stack as long as they share the same env (account and region):
```
const prod = { account: '123456789012', region: 'us-east-1' };
const s3stack = new S3BucketStack(app, 's3Stack' , { env: prod });

// stack2 will take a property { bucket: IBucket }
const stack2 = new StackThatExpectsAS3Bucket(app, 'Stack2', {
  bucket: s3stack.bucket, 
  env: prod
});
```
- Logic name and physical name
  - Logic name is assigned when instantiate a contruct, while physical name is generated by AWS and unique.
  - Physical name can be specified with property <resourceType>Name. 
```
const bucket = new s3.Bucket(this, 'MyBucket', {
  bucketName: 'my-s3-bucket-name',
});
```
  - Harcode physical name is not recommended because any changes to deployed resources that require a resource replacement, such as changes to a resource's properties that are immutable after creation, will fail if a resource has a physical name assigned

### Typical unique resource identifiers

- bucket.bucketName
- lambdaFunc.functionArn
- securityGroup.groupArn

To use those identifiers from other stack, follow the examples as follows:
```
// Construct a resource (bucket) just by its name (must be same account)
s3.Bucket.fromBucketName(this, 'MyBucket', 'my-bucket-name');

// Construct a resource (bucket) by its full ARN (can be cross account)
s3.Bucket.fromArn(this, 'MyBucket', 'arn:aws:s3:::my-bucket-name');

// Construct a resource by giving attribute(s) (complex resources)
ec2.Vpc.fromVpcAttributes(this, 'MyVpc', {
  vpcId: 'vpc-1234567890abcde',
});
```

### Token

Tokens are objects that implement the IResolvable interface, which contains a single resolve method. The AWS CDK calls this method during synthesis to produce the final value for the AWS CloudFormation template. Tokens participate in the synthesis process to produce arbitrary values of any type.

When the AWS CloudFormation template is finally synthesized, the token is rendered as the AWS CloudFormation intrinsic { "Ref": "MyBucket" }. At deployment time, AWS CloudFormation replaces this intrinsic with the actual name of the bucket that was created.

### Parameters

CloudFormation has parameters to set in deployment. CDK has the same with CfnParameter class.

- Use CfnParameter to create parameter in CDK construct
```
// Use CfnParameter to create parameter in CDK construct
const uploadBucketName = new CfnParameter(this, "uploadBucketName", {
  type: "String",
  description: "The name of the Amazon S3 bucket where uploaded files will be stored."}
);
```
- A CfnParameter instance exposes its value to your AWS CDK app via a token, use valueAsString, valueAsList, valueAsNumber, or value (token) to reference
```
const bucket = new Bucket(this, "myBucket", 
  { 
    bucketName: uploadBucketName.valueAsString
  }
);
```
- Deploy with parameters
  1. Deploy without parameters, input the values of each parameter when prompted.
  2. Deploy specifying parameters
```
cdk deploy MyStack --parameters uploadBucketName=UploadBucket
#cdk deploy MyStack --parameters p1=<p1 value> [--parameters pi=<pi value>]
```
  3. Deploy multiple stacks specifying stack for each parameter
```
cdk deploy MyStack YourStack --parameters MyStack:uploadBucketName=UploadBucket --parameters YourStack:uploadBucketName=UpBucket
```

### Tag

Tagging is implemented using Aspects. Aspects are a way to apply an operation (such as tagging) to all constructs in a given scope.

The Tag class includes two methods that you can use to create and delete tags:
- Tag.add() applies a new tag to a construct and all of its children.
- Tag.remove() removes a tag from a construct and any of its children, including tags a child construct may have applied to itself

```
import { App, Stack, Tag } from '@aws-cdk/core';

const app = new App();
const theBestStack = new Stack(app, 'MarketingSystem');

// Add a tag to all constructs in the stack
Tag.add(theBestStack, 'StackType', 'TheBest');

// Remove the tag from all resources except subnet resources
Tag.remove(theBestStack, 'StackType', {
  excludeResourceTypes: ['AWS::EC2::Subnet']
});
```

### Assets

Assets are local files, directories, or Docker images that can be bundled into AWS CDK libraries and apps; for example, a directory that contains the handler code for an AWS Lambda function. Assets can represent any artifact that the app needs to operate.
- A lambda.Function construct uses the code property to reference an asset (directory) 
- An Amazon ECS task definition uses ecs.ContainerImage.fromAsset to load a Docker image from a local directory

The AWS CDK creates a copy of the asset in the cloud assembly directory, which defaults to cdk.out, under the source hash.

The AWS CDK supports the following types of assets:
- Amazon S3 Assets: local files and directories that the AWS CDK uploads to Amazon S3.
- Docker Image: Docker images that the AWS CDK uploads to Amazon ECR.
```
import { Asset } from '@aws-cdk/aws-s3-assets';

// Archived and uploaded to Amazon S3 as a .zip file
const directoryAsset = new Asset(this, "SampleZippedDirAsset", {
  path: path.join(__dirname, "sample-asset-directory")
});

// Uploaded to Amazon S3 as-is
const fileAsset = new Asset(this, 'SampleSingleFileAsset', {
  path: path.join(__dirname, 'file-asset.txt')
});
```

Assume we define a lambda function in handler directory:
```
def lambda_handler(event, context):
  message = 'Hello World!'
  return {
    'message': message
  }
```

We can define the lambda function with this asset:
```
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';

export class HelloAssetStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const imageAsset = new Asset(this, "SampleAsset", {
      path: path.join(__dirname, "images/my-image.png")
    });

    new lambda.Function(this, 'myLambdaFunction', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'handler')),
      runtime: lambda.Runtime.PYTHON_3_6,
      handler: 'index.lambda_handler',
      environment: {
        'S3_BUCKET_NAME': imageAsset.s3BucketName,
        'S3_OBJECT_KEY': imageAsset.s3ObjectKey,
        'S3_URL': imageAsset.s3Url
      }
    });
  }
}
```

### Docker image assets
The AWS CDK supports bundling local Docker images as assets through the aws-ecr-assets module.

```
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as ecs from '@aws-cdk/aws-ecs';
import * as path from 'path';

const asset = new DockerImageAsset(this, 'MyBuildImage', {
  directory: path.join(__dirname, 'my-image'),
  //specify docker image build parameters
  buildArgs: {
    HTTP_PROXY: 'http://10.20.30.2:1234'
  }
});

const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDef", {
  memoryLimitMiB: 1024,
  cpu: 512
});

taskDefinition.addContainer("my-other-container", {
  image: ecs.ContainerImage.fromEcrRepository(asset.repository, asset.imageUri)
});

```

### Permission

Principals
An IAM principal is an entity that can be authenticated in order to access AWS resources, such as a user, a service, or an application. The AWS Construct Library supports many types of principals, including:
- IAM resources such as Role, User, and Group
- Service principals (new iam.ServicePrincipal('service.amazonaws.com'))
- Federated principals (new iam.FederatedPrincipal('cognito-identity.amazonaws.com'))
- Account principals (new iam.AccountPrincipal('0123456789012'))
- Canonical user principals (new iam.CanonicalUserPrincipal('79a59d[...]7ef2be'))
- AWS organizations principals (new iam.OrganizationPrincipal('org-id'))
- Arbitrary ARN principals (new iam.ArnPrincipal(res.arn))
- An iam.CompositePrincipal(principal1, principal2, ...) to trust multiple principals

Grants
Every construct that represents a resource that can be accessed, such as an Amazon S3 bucket or Amazon DynamoDB table, has methods that grant access to another entity
- grantRead
- grantReadWrite

Resources that use execution roles, such as lambda.Function, also implement IGrantable, so you can grant them access directly instead of granting access to their role.

```
bucket.grantRead(function);
```

To force the grant's permissions to be applied before another resource is created, you can add a dependency on the grant itself, as shown here. Though the return value of grant methods is commonly discarded, every grant method in fact returns an iam.Grant object.

```
const grant = bucket.grantRead(lambda);
const custom = new CustomResource(...);
custom.node.addDependency(grant);
```

Roles
The IAM package contains a Role construct that represents IAM roles. The following code creates a new role, trusting the Amazon EC2 service.

```
import * as iam from '@aws-cdk/aws-iam';

const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),   // required
});
```

Add permissions to a role by calling the role's addToPolicy method
```
role.addToPolicy(new iam.PolicyStatement({
  effect: iam.Effect.DENY,
  resources: [bucket.bucketArn, otherRole.roleArn],
  actions: ['ec2:SomeAction', 's3:AnotherAction'],
  conditions: {StringEquals: {
    'ec2:AuthorizedService': 'codebuild.amazonaws.com',
}}}));
```
Once the object is created, the role (whether the role passed in or the default one created by the construct) is available as the property role. This property is not available on imported resources, however, so such constructs have an addToRolePolicy 

```
// project is imported into the CDK application
const project = codebuild.Project.fromProjectName(this, 'Project', 'ProjectName');

// project is imported, so project.role is undefined, and this call has no effect
project.addToRolePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,   // ... and so on defining the policy
}));
```

### Context

Context values are key-value pairs that can be associated with a stack or construct.

Context values are made available to your AWS CDK app in six different ways:
- Automatically from the current AWS account.
- Through the --context option to the cdk command.
- In the project's cdk.context.json file.
- In the context key of the project's cdk.json file.
- In the context key of your ~/cdk.json file.
- In your AWS CDK app using the construct.node.setContext method.

The following are the context methods:
- HostedZone.fromLookup: Gets the hosted zones in the account.
- stack.availabilityZones: Gets the supported Availability Zones.
- StringParameter.valueFromLookup: Gets a value from the current Region's Amazon EC2 Systems Manager Parameter Store.
- Vpc.fromLookup: Gets the existing Amazon Virtual Private Clouds in your accounts.
- LookupMachineImage: Looks up a machine image for use with a NAT instance in an Amazon Virtual Private Cloud.

Don't forget to add the cdk.context.json file to your source control repository to ensure that subsequent synth commands will return the same result.

Use the ```cdk context``` command to view and manage the information in cdk.context.json file.

Example:
```
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

export class ExistsVpcStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
  
    super(scope, id, props);
    
    const vpcid = this.node.tryGetContext('vpcid');
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcId: vpcid,
    });
    
    const pubsubnets = vpc.selectSubnets({subnetType: ec2.SubnetType.PUBLIC});
    
    new cdk.CfnOutput(this, 'publicsubnets', {
      value: pubsubnets.subnetIds.toString(),
    });
  }
}
```

use cdk diff to see the effects of passing in a context value on the command line
```
cdk diff -c vpcid=vpc-0cb9c31031d0d3e22
```

## References
1. [Typescript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
2. [Working with CDK Typscript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html)
