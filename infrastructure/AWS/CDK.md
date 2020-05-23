# CDK basics

AWS CloudFormation enables developers to create and provision AWS infrastructure deployments predictably and repeatedly with a template file.

However, CloudFromation template is very hard to write and maintain. AWS CDK allows developers to define reusable cloud components (constructs) in a familiar programming language, which can be composed into Stacks and Apps.

![CDK architecture](/resources/img/cdkAppStacks.png)

The AWS CDK Toolkit (cdk command-line tool) and the AWS Construct Library are developed in TypeScript and run on Node.js.

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

```

# References
\[1\] [Typescript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
