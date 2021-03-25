# Rate limiter on DynamoDB

In the interconnected micro-service world, limit API calls, and throttle excessive visits are key to ensure the healthy service operation. 

Rate Limitation allows service providers to define API usage quota per client per interval(hour, minute, seconds, day, year).

Here we design distributed rate limiter with AWS DynamoDB.

## Requirements
1. Total calls to a designate API from this client won't exceed Q TPS;
2. Individual calls to a resource (with key K) with this API won't exceed I in total;

## Design alternatives

1. Token Bucket
For each client service, a token will be filled in some storage(Redis, DynamoDB, or Cassandra) for particular client service. Token contains a timestamp with quota limits. At every request this limit is checked whether the given client service has a quota left or not.
 <client_id, 06: 01: 00, 10>

2. Leaky Bucket
A Queue is maintained that holds the requests in FIFO. Requests that come after the queue is full, will be discarded/leaked. Leaky Bucket strategy will process the request at some average/constant rate.

3. Fix Window Counter:
In this we will keep the window for each client based on the interval. That time will increment the count with each request. Once the threshold is reached, it will reject the requests.

4. Sliding Logs
This algorithm is synced with real time verification of requests within interval. In this we keep on appending requests with timestamps in some storage. Once we got new request, we will check how many requests we had served in a given interval based on Rate Limiter. If requests exceed the threshold we will reject otherwise we will serve the request.
 Client 1: [ Timestamp1, Timestamp2, ……, Timestampn]

5. Sliding Window Counter
This is an optimised version of Sliding Logs where we will reduce the space requirements. Here while storing the logs for timestamp, if we get many requests at a particular timestamp.Then we will increase the update the same entry or we can store like Timestamp_count(request count)

## Challenages
With distributed systems at the same time requests can come to any server. Few Challenges and solutions:
Inconsistency


Race Condition
