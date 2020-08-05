# CDK context and Environment

In CDK deployment, it is important to retrieve context and environment variables such as stage, region, user, account, etc. This section will explore how to use context and environment.

## Environment

Each Stack instance in an AWS CDK app is explicitly or implicitly associated with an environment (env). 


### Set environment variables
An environment is the target AWS account and AWS Region into which the stack is intended to be deployed.
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
