# AWS infrastructure

## VPC

Amazon Virtual Private Cloud (Amazon VPC) is the network layer for EC2, which enables users to launch AWS resources into a virtual network that they define. This virtual network closely resembles a traditional network that users'd operate in their own data center, with the benefits of using the scalable infrastructure of AWS

Core concepts are:
- Virtual private cloud (VPC) — A virtual network dedicated to your AWS account. VPC is defined within a region, covering multiple AZs.
- Subnet — A range of IP addresses in the VPC, both public and private subset are supported. If a subnet is associated with a route table that has a route to an internet gateway, it's known as a public subnet. If a subnet is associated with a route table that does not have a route to an internet gateway, it's known as a private subnet. See [Subnet](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html).
- Route table — A set of rules, called routes, that are used to determine where network traffic is directed.
- Internet gateway — A gateway attaching to a VPC to enable communication between resources in the VPC and the internet. See [Internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html).
- VPN gateway - See [VPN connections](https://docs.aws.amazon.com/vpc/latest/userguide/vpn-connections.html).
- NAT gateway - Network address translation (NAT) gateway enables instances in a private subnet to connect to the internet or other AWS services, but prevents the internet from initiating a connection with those instances. See [NAT gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html).
- Customer gateway -
- VPC endpoint — Enables users to privately connect the VPC to supported AWS services and VPC endpoint services powered by PrivateLink without requiring an internet gateway, NAT device, VPN connection, or AWS Direct Connect connection. Instances in the VPC do not require public IP addresses to communicate with resources in the service. Traffic between the VPC and the other service does not leave the Amazon network. See AWS [PrivateLink and VPC endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/endpoint-services-overview.html).
- VPC Peering - A VPC peering connection is a networking connection between two VPCs that enables users to route traffic between them using private IPv4/IPv6 addresses. Instances in either VPC can communicate with each other as if they are within the same network. See [VPC Peering](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html).
- CIDR block — Classless Inter-Domain Routing. An internet protocol address allocation and route aggregation methodology. See [Classless Inter-Domain Routing](http://en.wikipedia.org/wiki/CIDR_notation) in Wikipedia.
- Security group - A stateful setting allows services to VPC
- Network Access Control Lists - A stateless setting allow or deny services to VPC

## VPC and commands

### VPC
- within a region

```shell
aws ec2 create-vpc --cidr-block 192.168.0.0/28 --profile fargate
aws ec2 describe-vpcs --vpc-id vpc-0ca77f7a1eaa670da --profile fargate
aws ec2 delete-vpc --vpc-id vpc-0ca77f7a1eaa670da --profile fargate

aws ec2 create-vpc --cidr-block 192.168.0.0/16 --profile fargate
aws ec2 describe-vpcs --vpc-id vpc-0b39341d010ee6478 --profile fargate
```

### Subnet 
- Like VLAN
- within a AZ

```
aws ec2 create-subnet --vpc-id vpc-0b39341d010ee6478 --cidr-block 192.168.0.0/24 --availability-zone us-west-2a  --profile fargate
aws ec2 describe-subnets --subnet-ids subnet-02a787cb22db69c9f --profile fargate
```

ENI (elastic network interface) — 
- network interface for instance
- Can be detached from an instance

```
aws ec2 create-network-interface --private-ip-address 192.168.0.99 --subnet-id subnet-02a787cb22db69c9f --profile fargate
aws ec2 describe-network-interfaces --network-interface-ids eni-00cc465d706a3e19f --profile fargate
```

Internet gateway 
- router

```
aws ec2 create-internet-gateway --profile fargate
aws ec2 attach-internet-gateway --internet-gateway-id igw-093bbac28c9ea0d9e --vpc-id vpc-0b39341d010ee6478 --profile fargate
aws ec2 describe-route-tables --filters Name=vpc-id,Values=vpc-0b39341d010ee6478 --profile fargate
aws ec2 create-route --route-table-id rtb-0a9cbff5674cf1bfd --destination-cidr-block "0.0.0.0/0"  --gateway-id igw-093bbac28c9ea0d9e  --profile fargate
```

security group
- firewall for instances
- m : n

```
aws ec2 create-security-group --group-name "web-ssh" --description  "web and ssh traffic" --vpc-id vpc-0b39341d010ee6478 --profile fargate
aws ec2 authorize-security-group-ingress  --group-id sg-09bda85178ea66b93 --protocol tcp --cidr 0.0.0.0/0 --port 22  --profile fargate
aws ec2 authorize-security-group-ingress  --group-id sg-09bda85178ea66b93 --protocol tcp --cidr 0.0.0.0/0 --port 80  --profile fargate
aws ec2 authorize-security-group-ingress  --group-id sg-09bda85178ea66b93 --protocol tcp --cidr 0.0.0.0/0 --port 443  --profile fargate
aws ec2 describe-security-groups --group-id sg-09bda85178ea66b93 --profile fargate
```

NACL
- stateless: no connection tracking, doesn’t automatically allow reply traffic.
- Rules are numbered, processed based on the number. * is the default rule. 
- firewall for subnet

```
aws ec2 create-network-acl  --vpc-id vpc-0b39341d010ee6478 --profile fargate
```

Inbound rule

```
aws ec2 create-network-acl-entry --ingress --cidr-block "0.0.0.0/0" --protocol tcp --port-range "From=22,To=22" --rule-action allow --network-acl-id acl-0da6f3db6189257ca --rule-number 70  --profile fargate
aws ec2 create-network-acl-entry --ingress --cidr-block "54.240.196.172/32" --protocol tcp --port-range "From=3389,To=3389" --rule-action allow --network-acl-id acl-0da6f3db6189257ca --rule-number 80  --profile fargate
aws ec2 describe-network-acls --network-acl-id acl-0da6f3db6189257ca --profile fargate
```

Outbound rule
- NACL is stateless. 
- to maintain compatibility, do not restrict outbound traffic using an NACL, instead, use security group to restrict outbound traffic.

Public IP Address
- Reachable from internet. 
- Not IP in RFC 1918 (192.168.0.0, routed in private network)
- Require internet gateway
- public IP address may change when reboot, or AWS maintenance

Elastic IP address (EIP)
- EIP is allocated to the account, it persists until you release it.
- EIP is in region, can’t be moved out of a region
- EIP is attached to ENI, can move it to different ENIs
- EIP can only attach to one ENI
- When EIP is attached to an ENI, its original public IP is replaced.
- You can bring your own public IP (BYOIP), up to 5 address blocks per region

```
aws ec2 allocate-address --profile fargate
aws ec2 associate-address --allocation-id eipalloc-08837e12a89b6b3b8 --network-interface-id  eni-00cc465d706a3e19f --profile fargate
```

Transit gateay
- Enable communication between multiple VPCs and on-premise network

```
Create a new VPC and subnet
aws ec2 create-vpc --cidr-block 172.17.0.0/16 --profile fargate
aws ec2 create-subnet --vpc-id vpc-066860d387cd31fc4 --cidr-block 172.17.0.0/24 --availability-zone us-west-2b  --profile fargate
aws ec2 describe-route-tables --filters Name=vpc-id,Values=vpc-066860d387cd31fc4 --profile fargate
```

Create transit gateway

```
aws ec2 create-transit-gateway --profile fargate
aws ec2 describe-transit-gateways --transit-gateway-id tgw-0dd6d9997e516c4a8 --profile fargate
aws ec2 create-transit-gateway-vpc-attachment --transit-gateway-id  tgw-0dd6d9997e516c4a8 --vpc-id vpc-066860d387cd31fc4 --subnet-ids subnet-051aa1d68a65c2add  --profile fargate
aws ec2 create-transit-gateway-vpc-attachment --transit-gateway-id  tgw-0dd6d9997e516c4a8 --vpc-id vpc-0b39341d010ee6478 --subnet-ids subnet-02a787cb22db69c9f  --profile fargate

aws ec2 search-transit-gateway-routes --transit-gateway-route-table-id tgw-rtb-0c3c917e07c11cddc --filters "Name=type,Values=static,propagated" --profile fargate

aws ec2 create-route --route-table-id rtb-0a9cbff5674cf1bfd --destination-cidr-block "172.17.0.0/16" --transit-gateway-id tgw-0dd6d9997e516c4a8  --profile fargate
aws ec2 create-route --route-table-id rtb-0f402bcb6a0812351 --destination-cidr-block "192.168.0.0/16" --transit-gateway-id tgw-0dd6d9997e516c4a8  --profile fargate

aws ec2 create-transit-gateway-route --destination-cidr-block "192.168.100.64/29" --transit-gateway-route-table-id tgw-rtb-0c3c917e07c11cddc --blackhole --profile fargate
aws ec2 search-transit-gateway-routes --transit-gateway-route-table-id tgw-rtb-0c3c917e07c11cddc --filters "Name=type,Values=static,propagated" --profile fargate

aws ec2 delete-transit-gateway-vpc-attachment --transit-gateway-attachment-id tgw-attach-0562f8bbbbccb777c --profile fargate
aws ec2 delete-transit-gateway-vpc-attachment --transit-gateway-attachment-id tgw-attach-092995ddfe103333e --profile fargate
aws ec2 search-transit-gateway-routes --transit-gateway-route-table-id tgw-rtb-0c3c917e07c11cddc --filters "Name=type,Values=static,propagated" --profile fargate
aws ec2 describe-transit-gateways --transit-gateway-id tgw-0dd6d9997e516c4a8 --profile fargate
aws ec2 delete-transit-gateway --transit-gateway-id tgw-0dd6d9997e516c4a8 --profile fargate
```
