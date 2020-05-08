# Cloudformation Concepts

Cloudformations work with templates and stacks. We create templates to describe AWS resources and their properties. Whenever creating a stack, AWS CloudFormation provisions the resources that are described in the template. 
- Templates
- Stacks 
- Change Sets

## Template
An AWS CloudFormation template is a JSON or YAML formatted text file. AWS CloudFormation uses these templates as blueprints for building your AWS resources.

## Stack
AWS CloudFormation manages related resources as a single unit called a stack. It creates, updates, and deletes a collection of resources by creating, updating, and deleting stacks.

## Change set
To make changes to the running resources in a stack, we update the stack. Before making changes to resources, we can generate a change set, which is a summary of proposed changes. Change sets allow users to see how the changes might impact running resources, especially for critical resources, before implementing them.

# How does Cloudformation work?

When you create a stack, AWS CloudFormation makes underlying service calls to AWS to provision and configure your resources. Note that AWS CloudFormation can perform only actions that you have permission to do. For example, to create EC2 instances by using AWS CloudFormation, you need permissions to create instances. You'll need similar permissions to terminate instances when you delete stacks with instances. You use AWS Identity and Access Management (IAM) to manage permissions.

# IAM: Access Control
There are 2 usages for IAM in the context of cloudformation:
- use IAM with AWS CloudFormation to control what users can do with AWS CloudFormation;
- manage what AWS services and resources are available to each user.

## AWS CloudFormation Actions
Action describes the operation on resources a user can perform, i.e: cloudformation:DescribeStacks, cloudformation:DescribeStackEvents.

For example:
```json
{
    "Version":"2012-10-17",
    "Statement":[{
        "Effect":"Allow",
        "Action":[
            "cloudformation:DescribeStacks",
            "cloudformation:DescribeStackEvents",
            "cloudformation:DescribeStackResource"
        ],
        "Resource":"*"
    },
    {
        "Effect":"Deny",
        "Action":[
            "cloudformation:DeleteStack",
            "cloudformation:UpdateStack"
        ],
        "Resource":"arn:aws:cloudformation:us-east-1:123456789012:stack/MyProductionStack/*"
    }]
}
```

# Cloudformation in action

troposphere: a python package to write in python and generate cloudlformation

## Cloudformation structure

A cloudformation templates have the following elements, all optional except resources:
- AWSTemplateFormatVersion: "2012-10-17"
- Description
- Metadata
- Mappings
- Conditions
- Paramters: will be asked to input when creating AWS stack with the template.
- Resources: required, staticaly created resources.
- Outputs: will be returned upon creation

For example:
```json
{
  "AWSTemplateFormatVersion" : "version date",
  "Description" : "JSON string",
  "Metadata" : {
    "Comment": "template metadata"
  },
  "Parameters" : {
    "Comment": "set of parameters",
    "SSHLocation": {
      "Description": "The IP address range that can be used to SSH to the EC2 instances",
      "Type": "String",
      "MinLength": "9",
      "MaxLength": "18",
      "Default": "0.0.0.0/0",
      "AllowedPattern": "(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})/(\\d{1,2})",
      "ConstraintDescription": "must be a valid IP CIDR range of the form x.x.x.x/x."
    },
    "KeyPair" : {
      "Description": "EC2 access key",
      "Type": "String"
    }
  },
  "Resources" : {
    "Comment": "set of resources",
    "EC2SecurityGroup": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "GroupDescription": "Enable SSH access",
        "SecurityGroupIngress": [
          {
            "IpProtocol": "tcp",
            "FromPort": "22",
            "ToPort": "22",
            "CidrIp": {
              "Ref": "SSHLocation"
            }
          }
        ]
      }
    },
    "EC2Instance": {
      "Properties": {
        "ImageId": "",
        "InstanceType": "",
        "KeyName": {
          "Ref": "KeyPair"
        },
        "SecurityGroups": [ {"Ref": "EC2ServerSecurityGroup"} ]
      },
      "Type": "AWS::EC2::Instance"
    }
  },
  "Mappings" : {
    "Comment": "set of mappings"
  },
  "Conditions" : {
    "Comment": "set of conditions"
  },
  "Transform" : {
    "Comment": "set of transforms"
  },
  "Outputs" : {
    "Comment": "set of outputs returned when the stack is created",
    "InstanceId": {
      "Value": { "Ref": "EC2Instance" }
    }
  }
}
```

## AWS Resources

### EBS Volume

```json
"EC2Volume": {
  "Type": "AWS::EC2::VOLUME",
  "Properties": {
    "Size": "50",
    "SnapshotId": "snapshot-dd221a",
    "AvailabilityZone": "eu-west-1a"
  }
}
```

### SecurityGroup

"EC2SecurityGroup": {
  "Type": "AWS::EC2::SecurityGroup",
  "Properties": {
    "GroupDescription": "SSH access",
    "SecurityGroupIngress": [{
      "IpProtocol": "tcp",
      "FromPort": "22",
      "ToPort": "22",
      "CidrIp": "0.0.0.0/0"
    }]
  }
}

### Reference to existing resources

- Reference to other resources: "SecurityGroups": [{"Ref": "EC2SecurityGroup"}]
- Reference to parameters: "KeyName": {"Ref": "KeyPair"} 

## AWS Condition

### Mappings

```json
- Region map
"Mappings" : {
  "RegionMap" : {
    "us-east-1"      : { "AMI" : "ami-0ff8a91507f77f867"},
    "us-west-1"      : { "AMI" : "ami-0bdb828fd58c52235"},
    "eu-west-1"      : { "AMI" : "ami-047bb4163c506cd98"},
    "ap-southeast-1" : { "AMI" : "ami-08569b978cc4dfa10"},
    "ap-northeast-1" : { "AMI" : "ami-06cd52961ce9f0d85"}
  }
}

"EC2Instance": {
  "Properties": {
    "ImageId": { Fn::FindInMap: ["RegionMap", {"Ref": "AWS::Region"}, "AMI"] }
    "InstanceType": "",
    "KeyName": {
      "Ref": "KeyPair"
    },
    "SecurityGroups": [ {"Ref": "EC2ServerSecurityGroup"} ]
  },
  "Type": "AWS::EC2::Instance"
}
```

Intrinsic functions:
- Fn::FindInMap
- Fn::Base64
- Fn::GetAtt
- Fn::GetAZs
- Fn::Select
- Fn::Join
- Ref

Global parameters:
- AWS::Region
- AWS::StackId
- AWS::StackName
- AWS::NotificationARNs

## Non AWS Resources
Define custom resources and include non-AWS resources in CloudFormation stack.

# Bootstrapping AWS cloudformation

## Option 1: define UserData in EC2 resource
```json
"EC2Instance": {
  "Properties": {
    "ImageId": { Fn::FindInMap: ["RegionMap", {"Ref": "AWS::Region"}, "AMI"] }
    "InstanceType": "",
    "KeyName": { "Ref": "KeyPair" },
    "SecurityGroups": [ {"Ref": "EC2ServerSecurityGroup"} ],
    "UserData": { "Fn::Base64" { "Fn::Join": ["", [
      "#!/bin/bash -ex", "\n",
      "yum -y install gcc-c++ make", "\n"
    ]] } }
  },
  "Type": "AWS::EC2::Instance"
}
```

## Option 2: define AWS cloudformaton helper scripts
- cfn-init
- cfn-get-metadata
- cfn-signal
- cfn-hup

cfn-init is defined in clouformation metadata, the key is "AWS::CloudFormation::Init"
