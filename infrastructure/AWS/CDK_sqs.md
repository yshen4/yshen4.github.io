# SQS

## 

## Error handling and DLQ

When Lambda reads a batch, the messages stay in the queue but become hidden for the length of the queue's visibility timeout. If the function successfully processes the batch, Lambda deletes the messages from the queue. If the function is throttled, returns an error, or doesn't respond, the message becomes visible again after the visibility timeout expires. All messages in a failed batch return to the queue, so the function code must be able to process the same message multiple times without side effects.

For better handling of partial faiures, 2 options are available:
- Use a batchSize of 1. This eliminates the problem of partial failures altogether but limits the throughput of how quickly you are able to process messages. In low traffic scenarios, it can be a simple and yet effective solution.
- Ensure idempotency. This allows messages to be safely processed more than once. But in processing a message, if you have to update multiple systems then it’s difficult to achieve idempotency. You might find yourself reaching out for solutions such as saga patterns, which adds much complexity to the system.

Lambda auto-scales the number of pollers based on traffic. This is great until the SQS function uses up too much of the available concurrent executions in the region. When the regional concurrency limit is breached, any Lambda invocations can be throttled.

## Reference
1. https://lumigo.io/blog/sqs-and-lambda-the-missing-guide-on-failure-modes/
2. [Best Practices for Serverless Queue Processing](https://youtu.be/SDAXRKwTQIk)
3. [Hitchhiker’s Guide to AWS Step Functions](https://epsagon.com/development/hitchhikers-guide-to-aws-step-functions/)
4. 
