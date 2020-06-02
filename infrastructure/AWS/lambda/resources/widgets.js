/* 
This code uses callbacks to handle asynchronous function responses.
It currently demonstrates using an async-await pattern. 
AWS supports both the async-await and promises patterns.

For more information, see the following: 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/calling-services-asynchronously.html
https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html 
*/
const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucketName = process.env.BUCKET;

// GET / all widgets
// GET /name to get infor on widget name
const getHandler = async (path, widgetName) => {
  if (path === "/") {
    const data = await S3.listObjectsV2({ Bucket: bucketName }).promise();
    var body = {
      widgets: data.Contents.map(function(e) { return e.Key })
    };
    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify(body)
    };
  }

  if (widgetName) {
    // GET /name to get info on widget name
    const data = await S3.getObject({ Bucket: bucketName, Key: widgetName}).promise();
    var body = data.Body.toString('utf-8');
    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify(body)
    };
  }
};

// POST /name
const postHandler = async (widgetName) => {
  // Create some dummy data to populate object
  const now = new Date();
  var data = widgetName + " created: " + now;

  const dataObj = {
    Bucket: bucketName,
    Key: widgetName,
    Body: new Buffer(data, 'binary'),
    ContentType: 'application/json'
  };

  await S3.putObject(dataObj).promise();

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(dataObj)
  };
};

// DELETE /name
const deleteHandler = async (widgetName) => {
  await S3.deleteObject({
    Bucket: bucketName, Key: widgetName
  }).promise();

  return {
    statusCode: 200,
    headers: {},
    body: "Successfully deleted widget " + widgetName
  };
}

// We got something besides a GET, POST, or DELETE
const unsupportedMethodHandler = (method) => {
  return {
    statusCode: 400,
    headers: {},
    body: "We only accept GET, POST, and DELETE, not " + method
  };
};

exports.main = async function(event, context) {
  try {
    var method = event.httpMethod;

    // get widget name
    var widgetName = event.path.startsWith('/') ? event.path.substring(1) : event.path;
    // Return an error if we do not have a name
    if (method !== "GET" && !widgetName) {
      return {
        statusCode: 400,
        headers: {},
        body: "Widget name missing"
      };
    }

    if (method === "GET") {
      return getHandler(event.path, widgetName);
    }
    else if (method === 'POST') {
      return postHandler(widgetName);
    }
    else if (method === 'DELETE') {
      return deleteHandler(widgetName);
    }
    else {
      unsupportedMethodHandler(method);
    }
  } catch(error) {
    var body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
        headers: {},
        body: JSON.stringify(body)
    }
  }
}

