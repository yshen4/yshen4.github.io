# CDK context and Environment

In CDK deployment, it is important to retrieve context and environment variables such as stage, region, user, account, etc. This section will explore how to use context and environment.

## Environment

Each Stack instance in an AWS CDK app is explicitly or implicitly associated with an environment (env). 

An environment is the target AWS account and AWS Region into which the stack is intended to be deployed.

### Set environment variables
There are several ways to set environment variables:
- Explicitly specify them in env
- Use the specified or default AWS CLI profile, use environment variables provided by the AWS CDK CLI: CDK_DEFAULT_ACCOUNT and CDK_DEFAULT_REGION
- Use user defined environment variables, for example(variable names can be any): CDK_DEPLOY_ACCOUNT and CDK_DEPLOY_REGION

Example 1: hardcoded environment variables
```
const envEU  = { account: '2383838383', region: 'eu-west-1' };
new euStack(app, 'f3cat-stack-eu', { env: envEU });

const envNA = { account: '8373873873', region: 'us-east-1' };
new naStack(app, 'f3cat-stack-us', { env: envNA });
```

Example 2: Use CDK CLI variables CDK_DEFAULT_ACCOUNT/CDK_DEFAULT_REGION
```
new desktopStack(app, 'desktop', { 
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
}});
```
These variables are set based on the AWS profile specified using the --profile option, or the default AWS profile if you don't specify one.

Example 3: User defined variables
```
new desktopStack(app, 'desktop', { 
  env: { 
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION 
}});
```
In example 3, use the shell script to set user defined variables:
```
#!/usr/bin/env bash
if [[ $# -ge 2 ]]; then
    export CDK_DEPLOY_ACCOUNT=$1
    export CDK_DEPLOY_REGION=$2
    # skip parameter 1 and 2
    shift; shift
    npx cdk deploy "$@"
    exit $?
else
    echo 1>&2 "Provide AWS account and region as first two args."
    echo 1>&2 "Addiitonal args are passed through to cdk deploy."
    exit 1
fi
#deploy_cdk <account Id> <region> stack
```

### Get environment variables
Typescript and javascript get environment variables with process.env, while python uses either os.environ parameter, or os.getenv function.
```

// Sets bucket_name to undefined if environment variable not set
const account = process.env.account;
const region = process.env.region;

// Sets bucket_name to a default if env var doesn't exist
const account = process.env.account || "123456";
const region = process.env.region || "us-east-1";

```

## Context
Context values are key-value pairs that can be associated with a stack or construct. The AWS CDK uses context to cache information from the target AWS account, such as the Availability Zones in AWS account or the Amazon Machine Image (AMI) IDs.

### Set context
Context values are made available to a AWS CDK app in six different ways:
- Automatically from the current AWS account.
- Through the --context option to the cdk command.
- In the project's cdk.context.json file.
- In the project's cdk.json file.
- In the context key of user's ~/cdk.json file.
- In the AWS CDK app using the construct.node.setContext method.

AWS CDK caches context retrieve values from cdk.context.json for the AWS account. Context values are scoped to the construct that created them; they are visible to child constructs, but not to siblings. 

Context values set by the AWS CDK Toolkit (the cdk command), whether automatically, from a file, or from the --context option, are implicitly set on the App construct, and so are visible to every construct in the app. 

### Get context
Constructs get a context value using the construct.node.tryGetContext method. If the requested entry is not found on the current construct or any of its parents, the result is undefined (or your language's equivalent, such as None in Python).

The AWS CDK supports context methods that allow AWS CDK apps to get contextual information.
- HostedZone.fromLookup: Gets the hosted zones in your account.
- stack.availabilityZones: Gets the supported Availability Zones.
- StringParameter.valueFromLookup: Gets a value from the current Region's Amazon EC2 Systems Manager Parameter Store.
- Vpc.fromLookup: Gets the existing Amazon Virtual Private Clouds in your accounts.
- LookupMachineImage: Looks up a machine image for use with a NAT instance in an Amazon Virtual Private Cloud.

If a given context information isn't available, the AWS CDK app notifies the AWS CDK CLI that the context information is missing. The CLI then queries the current AWS account for the information, stores the resulting context information in the cdk.context.json file, and executes the AWS CDK app again with the context values.

### Commands
Show all context (in cdk.context.json):
```
cdk context
```

Reset context (the second key):
```
cdk context --reset 2
```

Clear context:
```
cdk context --clear
```

Use --context to set context values in synth or deploy:
```
# specify a single context value
cdk synth --context key=value MyStack

# specify multiple context values (any number)
cdk synth --context key1=value1 --context key2=value2 MyStack

# different context values for each stack
cdk synth --context Stack1:key=value Stack2:key=value Stack1 Stack2
```

Use cdk diff to see the effects of passing in a context value on the command line:
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
    const pub_subnets = vpc.selectSubnets({subnetType: ec2.SubnetType.PUBLIC});
    new cdk.CfnOutput(this, 'publicsubnets', {
      value: pub_subnets.subnetIds.toString(),
    });
  }
}

# see the effects of passing in a context value on the command line
$ cdk diff -c vpcid=vpc-0cb9c31031d0d3e22

# see the resulting context values
$ cdk context -j
```
