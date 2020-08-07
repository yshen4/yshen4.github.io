# Logging in distributed environment

In distributed environment, logging and tools to analyze logs become more important. In most of trouble shooting sessions, we need logs to answer:
- What was the problem?
- When did the problem happen?
- Where was the problem(node, service, region, etc)?
- How did the problem happen?

However, while distributed system is more scalable, it casts challenges for logging. 

In the document, we will summarize logging for data intensive applications deployed in the cloud:
- What to log?
- How to log?
- How to categorize the information logging?

## General concepts
### What information to log?

Logging is for human analysis, therefore we should consider logging the following information in humanly readable text:
1. timestamp
2. Identification id for the request, session, service, etc;
3. Log in text format, and make it developer friendly;
4. Put semantic context in the log;
5. Log the source: file, class, function.

### How to log?

As is all distributed services, we design logging for failures:
1. Log locally to files, which still function with network failures, or system congestion.
2. Use rotation policies to avoid log files grow too big;
3. Collect events from everything, everywhere;
4. Log at the right level.

### How to categorize the information?

For logging at the right level, it is easier to said than done. Here we try to provide a guide to categorize information in different levels defined in Log4j.

Level  | Description
------ | -----------
TRACE  | Designate finer-grained informational events than the DEBUG. This should only be used during development to track bugs, but never committed to your code repository. This is a code smell if used in production
DEBUG  | Designate fine-grained information for debugging. Log at this level about anything that happens in the program. This is mostly used during debugging, and trim down the number of debug statement before entering the production stage, so that only the most meaningful entries are left, and can be activated during troubleshooting.
INFO   | Designate information to highlight application progress in coarse-grainded level. Log at this level all actions that are user-driven, or system specific (ie regularly scheduled operations…). Typically used in production.
WARN   | Designate potentially harmful situations. Log at this level all events that could potentially become an error. For instance if one API call took more than a predefined time, or if an in-memory cache is near capacity. This will allow proper automated alerting, and during troubleshooting will allow to better understand how the system was behaving before the failure.
ERROR  | Designates error events that might still allow the application to continue running. Log every error condition at this level. That can be API calls that return errors or internal error conditions.
FATAL  | Designate severe error events that will lead the service down. Too bad, it’s doomsday. Use this very scarcely, this shouldn’t happen a lot in a real program. Usually logging at this level signifies the end of the program. For instance, if a network daemon can’t bind a network socket, log at this level and exit is the only sensible thing to do.

## Good and bad examples

Usually we don't make mistakes when errors need to be logged. The tricky ones are always with debug and info, sometimes warning. This also varies from one application to another. Logging every event with INFO may be OK for control plane service, it is too excessive for data intensive applications.

1. Excessive development information is logged at INFO level for each event write 
```
override fun process(key: String, timestampedData: TimestampedData<String>) {
    val value = timestampedData.data
    try {
        val headerReader = HeaderReader(context.headers())
        if (headerReader.isIntegrationTest) {
            ...
        } else {
            // While the information is important for diagnosis, log every event to the log is excessive. We have try/catch if any error happens
            log.info()
               .message("Writing event ($value) to SNS (${config.snsTopicArn}) for topic (${config.kafkaTopic})")
               .log()
            snsProxy.publishObject(config.snsTopicArn, value)
        }
    } catch (exception: Exception) {
        log.error() ...
        cloudWatchMetricsLogger.addCount(SNS_PUBLISH_FAIL_METRIC_NAME, 1.0, dimensions)
    }
}
```

2. A good example of logging warnings for system delays

It isn't an error, but may need some investigation.

```
val wallClockTime = clock.millis()
if (checkpointTimestampMillis < wallClockTime) {
    // It shows warning sign if the checkpoint is in the past, which is worthy investigation 
    log.warn("Received an alert event where the checkpoint is in the past. wall clock time: $wallClockTime, key, $key, event: $alertEvent, ${context.contextInfoString()}")
    return
}
```
