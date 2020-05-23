# Summary
This page is to record javascript best practices. Each item is composed 3 parts:
- A description of the problem
- A classic solution
- Analysis and best practices with mordern javascript (ES6+)

## 1. Use console.log to write debug information

### Problem statement
In javascript development, from time to time, we write information to console so we can diagnose a bug or find details of the logic.

### Classic solution

```javascript
const dog = { name: "bar bark", age: 3, color: "brown", weight: 25 };
const cat = { name: "miao miao", age: 5, color: "white", weight: 12 };
const lizard = { name: "slow", age: 1, color: "grey", weight: 0.02 };

Console.log(dog, cat, lizard);
```

### Analysis and best practices
Although we have the variable values, we don't know which variables are they associated with. The data aren't formatted so very hard to read.

console supports much richer APIs at our disposal.
- '%c': Highlight sentences
- {var}: show variable name along with content
- table: show variable list or map in table format
- time/timeEnd: start and stop timer
- trace: show javascript file and line

```javascript
// Add highlights
console.log( '%cPets', 'color: orange; font-weight: b');

// Set a timer
console.time('timer_check');

console.trace('Log with variable names');
console.log( {dog, cat, lizard} );

// A better way is to log them in a table
// We can use {} or [], I prefer {} because the indices are variable names instead of numbers
console.trace('Log in a table');
console.table( {dog, cat, lizard} );

// End a timer
console.timeEnd('timer_check');
```

## 2. Use destructuring to get members from a complex object

### Problem

A lot of times we receive a complex object, and only need several of its members. 

### Classic usage

```javascript
const dog = { name: 'bar bark', age: 3, color: 'brown', weight: 25, owner: { name: 'Yue', state: 'California' } };

const findOwner = (animal) => {
  console.log(`${animal.name} is ownned by ${animal.owner.name}`);
};

```

### Analysis and best practice

Use destructuring to simplify the variable reference
- Only get needed members from the object;
- Support nested structures 
- Support renaming to avoid name confliction
- Support default value

```javascript
const findOwner = (animal) => {
  // owner.name is nested, to destructure it, need owner for destructuring, then name as nested field.
  // animal.name and owner.name are conflicting, therefore we rename the owner.name as ownerName after destructuring
  // In case owner is undefined, use {} as default, in which name is undefined, but the code won't throw exception
  const { name, owner: {name: ownerName} = {} } = animal;
  
  // We can also provide default value to ownerName in case owner isn't defined
  //const { name, owner: {name: ownerName = "unknown"} = {} } = animal;

  console.log(`${name} is ownned by ${ownerName}`);
};
```

## 3. Use spread operator for copying and cloning
Spread syntax allows an iterable such as an array or string to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected, or an object expression to be expanded in places where zero or more key-value pairs (for object literals) are expected

### spread on array
```
const first = [1, 2, 3];
const second = [4, 5, 6];

// use concat
first.concat(second);

// use spread operator
[...first, ...second];

// clone with spread
const clone = [...first];
```
### spread on object
```
const namePart = { name: "Yue"};
const jobPart = { job: "Engineer"};

const combined = {...namePart, ...jobPart, location: "los angeles"};

// clone with spread
const clone = {...combined};
```


## 4. Javascript stream APIs: filter, map, and reduce

## 5. async and wait

## 6. Ajax

There are several ways to make ajax call in javascript
- XMLHttpRequest
- Fetch
- Axios
- jQuery
- request

## 6.1 XMLHttpRequest

```
function callAjaxGet(url, callback) {
  const http = new XMLHttpRequest();
  http.open("GET", url);
  http.send();
  http.onreadystatechange= (e) => {
    callback(e, http.responseText)
  }
}

function callAjaxPost(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/submit', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = (e) => callback(e, xhr.responseText);
  xhr.send(`${url}?name=foo&id=1`);
}

callAjaxGet('www.google.com', (e, resp) => { 
    console.table(e);
    console.log(resp);
});

callAjaxPost('www.google.com/', (e, resp) => {
  console.table(e);
  console.log(resp);
});
```

## 6.2 Fetch API
Pros of using Fetch API
- It’s flexible and easy to use
- Callback hell is avoided by Promises
- Supported by all modern browsers
- Follows request-response approach

Cons of using Fetch API
- Doesn’t send cookie by default
- CORS is disabled by default

```
fetch('https://www.google.com', {
        method: 'get', mode: "no-cors"
    })
    .then(response => console.log(response))
    .catch(err => console.log(err));

```

## 6.3 Axios

```javascript
axios.get('/get-user', {
    params: {
      ID: 1
    }
  })
  .then( (response) => console.log(response) )
  .catch((err) => console.log(err) )
  .then( () => {
    // always executed
  });
```

## 6.4 jQuery

```
$.ajax({
    url: '/users',
    type: "GET",
    dataType: "json",
    success: function (data) {
        console.log(data);
    },
    error: function (error) {
        console.log(`Error ${error}`);
    }
});
```

## 6.5 Request

Use javascript request library to do HTTP calls

```
var request = require('request');
request('http://www.yourdomain.com', function (error, response, body) {
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode); 
  console.log('body:', body);
});
```
# References
[1] https://www.slideshare.net/teppeis/effective-es6
[2] https://www.w3schools.com/jquery/ajax_ajax.asp
