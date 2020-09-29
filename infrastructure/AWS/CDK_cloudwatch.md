# Define Cloudwatch with CDK

## Workflow
1. Define cloudwatch metrics
2. Define cloudwatch alarms
3. Define cloudwatch carnaval monitor
4. Construct alarms in the app
5. Define dashboard with metrics

## Define cloudwatch metrics

There are 2 ways to define metrics in CDK:
- use existing metric
- Define a new metric

Example to use existing metric:

```typescript
const dlqMessageCountMetric = dlq.metric("ApproximateNumberOfMessagesVisible");
```

Example to define a new metric:

```typescript
function createMessageCountMetric(dlsQueueName: string) {
  return new Metric({
    namespace: 'AWS/SQS',
    metricName: 'ApproximateNumberOfMessagesVisible',
    dimensions: {
      'QueueName': `${dlsQueueName}`
    }  
 });
}

dlqMessageCountMetric = createMessageCountMetric('myDLQ');
```

## Define cloudwatch alarm

There are 2 ways to define an alarm too:
- Create a new alarm
- Use Metric.createAlarm function.

With defined metric, define the alarm, set the threshold, period and datapoints:

```
const alarm = new cloudwatch.Alarm(this, 'Alarm', {
  metric: dlqMessageCountMetric,
  threshold: 5,
  evaluationPeriods: 60,
  datapointsToAlarm: 3,
});
```

An alternative way to create an alarm is using the metric's createAlarm() method, which takes essentially the same properties as the Alarm constructor;

```
const alarm = dlqMessageCountMetric.createAlarm(this, 'Alarm', {
  threshold: 5,
  evaluationPeriods: 60,
  datapointsToAlarm: 3,
});
```

## Define Carnaval monitor on alarm

The best way to use alarms is to hook up with a notification system, such as Carnaval

```
const monitor = new CarnavalMonitor(this, `Sev3-CarnavalMonitor-DLQ`, {
  name: `DLQ-CarnavalMonitor`,
  owner: owner,
  region: region,
  alarms: [CloudWatchAlarmMonitor.fromCloudWatchAlarm(alarm)],
  ticketNotification: {
    cti: cti,
    severity: Severity.SEV3,
    details: alarm.alarmName
  }  
});
```

## Deploy the monitor along with alarms

## Define dashboard with metrics

In addition to alarms, we can define dashboard to visualize the system operation and monitoring.

First of all, need to import cloudwatch package:

```javascript
import {Dashboard, GraphWidget, TextWidget} from "@aws-cdk/aws-cloudwatch";
import {Construct} from "@aws-cdk/core";
```

Secondly, create widgets.

```
const widgetTitle = new TextWidget({
      markdown: "MyWidget",
      width: 24,
      height: 1
    });

const widgetInstance = new GraphWidget({
    title: title,
    width: 8,
    height: 6, 
    left: [dlqMessageCountMetric],
    right: [...],
    stacked: false
  });
```

Define Dashboard instance and add widgets by addWidgets or in the constructor:

```javascript
const dashboard =  new Dashboard(scope, `MyDashboard`, {
  dashboardName: `MyDashboard`, //name, must be unique in the account
  start: '-P3H', //Start time
  widgets: [[widgetTitle], [widgetInstance]]
});
```

## Reference
1. https://docs.aws.amazon.com/cdk/latest/guide/how_to_set_cw_alarm.html
2. https://docs.aws.amazon.com/cdk/api/latest/docs/aws-cloudwatch-readme.html 
3. https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-cloudwatch.Dashboard.html
4. https://docs.aws.amazon.com/cloudwatch/index.html
