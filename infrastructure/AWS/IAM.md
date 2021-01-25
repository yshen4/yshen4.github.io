# AWS IAM

## IAM basics

### Concepts

AWS IAM ensures providing the right users, the right access, to the right resources, at the right time.

AWS IAM supports authentication and authorization for a request. Users must sign in and must have the necessary permissions to perform any action. Authentication and authorization are used together. Authorization always follows authentication. Users must prove who they are before they can do something on the resources.

#### Authentication

Authentication is the act of proving an assertion, such as the identity of a user [1]. While identification is the act of indicating an identity, authentication is the process of verifying that identity with credentials. 

3 common ways to authenticate a user are:
1. Password
2. Biometric, such as fingerprint or face
3. Token, such as Access keys with AWS

#### Authorization

Authorization is the process of giving users permissions to act on a specific resource or service.

Authorization is defined in policies, against which AWS checks action permission on all requested resources from the request context.  

#### Resources
The user, group, role, policy, and identity provider objects that are stored in IAM. As with other AWS services, users can add, edit, and remove resources from IAM.

#### Identities
The IAM resource objects that are used to identify and group. You can attach a policy to an IAM identity. These include users, groups, and roles.

#### Entities
The IAM resource objects that AWS uses for authentication. These include IAM users, federated users, and assumed IAM roles.

#### Principals
A person or application that uses the AWS account root user, an IAM user, or an IAM role to sign in and make requests to AWS.

### User and group

### Policy

#### Principal

Principal element in a policy specifies the principal that is allowed or denied access to a resource. We cannot use the Principal element in an IAM identity-based policy. We can use it in the trust policies for IAM roles and in resource-based policies. 

Resource-based policies are policies that we embed directly in a resource. For example, we can embed policies in an Amazon S3 bucket or an AWS KMS customer master key (CMK).

We can specify any of the following principals in a policy:
- AWS account and root user
- IAM users
- Federated users (using web identity or SAML federation)
- IAM roles
- Assumed-role sessions
- AWS services
- Anonymous users (not recommended)

Use the Principal element in these ways:
- In IAM roles, use the Principal element in the role's trust policy to specify who can assume the role. For cross-account access, you must specify the 12-digit identifier of the trusted account.
- In resource-based policies, use the Principal element to specify the accounts or users who are allowed to access the resource.

#### Resource

#### Action

#### Condition

#### Effect

### Role

## IAM in CDK

## IAM best practices

## Reference
[1] https://en.wikipedia.org/wiki/Authentication
[2] https://en.wikipedia.org/wiki/Authorization
[3] https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html
[4] https://docs.aws.amazon.com/IAM/latest/UserGuide/id.html
[5] https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_effect.html
[6] https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_action.html
[7] https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html
[8] https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
