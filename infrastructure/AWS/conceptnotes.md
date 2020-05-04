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

## Create templates

## 
