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
