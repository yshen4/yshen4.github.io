# Frameworks

Opensource frameworks have become the main phenomina in the past decades. 

## Cassandra
- Deploy Cassandra on AWS
- Data modelling
- Performance tuning

## Elasticsearch
- Deploy Elasticsearch on AWS
- Data modelling
- Performance tunning

## Redis
- Deploy Redis on AWS
- Rate limiter with Redis
- Message recall with Redis

## ZooKeeper
- Deploy ZooKeeper on AWS

## Kafka
- Deploy Kafka on AWS
- Kafka streaming

## Druid
- Deploy Druid on AWS
- Druid modelling
- Integrate Druide with Kafka Streaming

## Flink
[Apache Flink](https://flink.apache.org/) is a framework and distributed processing engine for stateful computations over unbounded and bounded data streams. Flink has been designed to run in all common cluster environments, perform computations at in-memory speed and at any scale.
- Unbounded streams have a start but no defined end. Processing unbounded data often requires that events are ingested in a specific order, such as the order in which events occurred, to be able to reason about result completeness.
- Bounded streams have a defined start and end. Ordered ingestion is not required to process bounded streams because a bounded data set can always be sorted. Processing of bounded streams is also known as batch processing. 

[Flink notes](framework/flink/flink.md)
