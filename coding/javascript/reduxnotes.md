# Basics

## Functional programming

Functional programming is the process of building software by composing pure functions, avoiding shared state, mutable data, and side-effects. Functional programming is declarative rather than imperative, and application state flows through pure functions.
1. Pure functions: [What is pure funtion?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976)
   - Given the same inputs, always returns the same output, and
   - Has no side-effects
2. Function composition
3. Avoid shared state
   - Without shared state, the timing and order of function calls don’t change the result of calling the function
4. Avoid mutating state: [The Dao of Immutability](https://medium.com/javascript-scene/the-dao-of-immutability-9f91a70c88cd)
5. Avoid side effects

Example 1: javascript array map, filter, and reduce
```javascript
let data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const isEven = data.map( n => n % 2 == 0 );
const odds = data.filter( n => n % 2 != 0 );
const total = data.reduce( (sum, n) => sum += n, 0 );
```

### Function composition
The key for functional programming is function composition, which combines two or more functions in order to produce a new function or perform some computation. Therefore we write several simple functions, and compose them to do one complicated task.

```javascript
/*
 * const input = '    Javascript   ';
 * const result = '<div>' + input.trim() + '</div>';
 */

// Let's do it in functional compsition
const trimStr = (str) => str.trim();
//javascript template 
const divWrap = (str) => `<div>${str}</div>`; 

divWrap(trimStr('    JavasCriPt   '));
//output: "<div>JavasCriPt</div"

//chain more functions
const toLowerCase = str => str.toLowerCase();
divWrap(toLowerCase(trimStr('    JavasCriPt   ')));
//output: "<div>javascript</div"
```

### Composing and piping
Function calls like divWrap(toLowerCase(trimStr(...))) can get very verbose. A better way is to pipe and compose.

```javascript
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
pipe(trimStr,
     toLowerCase,
     divWrap) ('    JavasCriPt   ');
//output: "<div>javascript</div"
```
Reference: [Javascript pipe](https://medium.com/free-code-camp/pipe-and-compose-in-javascript-5b04004ac937) 

### Currying
With pipe, we have a problem:
- all variables piped must be functions;
- The output of the previous function is the input of this function

In the case above, what if we want to change div to span, or section? 

```javascript
const wrap = (type, str) => `<${type}>${str}</${type}>`
//this will fail: Uncaught TypeError: f is not a function
//pipe(trimStr, toLowerCase,wrap('span')) ('    JavasCriPt   ');
```

Instead of define const wrap = (type, str) => `<${type}>${str}</${type}>`, we should chain the input parameters like:
```javascript
function wrap(type) {
  return function(str) {
    return `<${type}>${str}</${type}>`;
  }
}
```

Or in the functional programming, it becomes:
```javascript
const wrap = (type) => (str) => `<${type}>${str}</${type}>`;
```

In that case, call wrap('span', input) becomes wrap('span')(input). 
```
pipe(trimStr,
     toLowerCase,
     wrap('span')) ('    JavasCriPt   ');
//Output: <span>javascript</span>
```

### Pure function
Rules for pure functions:
- No random function call
- No current date/time
- No global state
- No parameter mutation

Benefits:
- Self explanable
- Easy to test
- Currency
- Cacheable

### Immutability
Javascript isn't designed to be functional programmig from start. 
```
book = {};
book.title = 'math';
console.log(book);
//Output: {title: "math"}
```

Make it const won't ensure immutability because although book is const, its member can vary.
```
const book = {};
book.title = 'math';
console.log(book);
//Output: {title: "math"}
```
This will fail with Uncaught TypeError: Assignment to constant variable.
```
const book = {title: 'physics'};
book = {title: 'math'};
```

Pros:
- Predictability
- Concurrency
- Fast change detection

Cons:
- Performance
- Memory overhead

### Object assignment

How do we update objects in paradigm of immutability?

Option 1: Object.assign
```
const person = {name: "Yue"};
const updatedPerson = Object.assign({}, person, {job: "Engineer"});
//Ouput: {name: "Yue", job: "Engineer"}
```

Option 2: spread operator
```
const person = {name: "Yue"};
const updatedPerson = {...person, name: "Ye", job: "Engineer"};
//Ouput: {name: "Ye", job: "Engineer"}
```
Reference: [Javascript spread operator](https://medium.com/coding-at-dawn/how-to-use-the-spread-operator-in-javascript-b9e4a8b06fab)

One issue with spread operator is that it creates a shallow copy for the original object, which may cause problems in the nested data structure.
```
const person = { name: "Yue", address: { country: "USA", city: "Los Angeles"} };
const updatedPerson = {...person, name: "Ye", job: "Engineer"};
updatedPerson.address.city = "New York";
console.log(person);
console.log(updatedPerson);
//Ouput: {name: "Yue", address: { country: "USA", city: "New York"} }
//Ouput: {name: "Ye", job: "Engineer", address: { country: "USA", city: "New York"} }
```

In order to avoid this problem, we need to use spread operator on the nested data too
```
const person = { name: "Yue", address: { country: "USA", city: "Los Angeles"} };
const updatedPerson = {...person, name: "Ye", job: "Engineer", address: { city: "New York"}};
console.log(person);
console.log(updatedPerson);
//Ouput: {name: "Yue", address: { country: "USA", city: "Los Angeles"} }
//Ouput: {name: "Ye", job: "Engineer", address: { country: "USA", city: "New York"} }
```

### Array operation
- Append a new value
- Remove a value
- Update a value

```
const data = [1, 2, 3, 4, 5, 6, 7];
//Append to the end
const appended = [...data, 8];
console.log(appended);

//Append to the start
const prended = [0, ...data]
console.log(prended);

//Insert before 4
const index = data.indexOf(4);
const inserted = [...data.slice(0, index),
                  9,
                  ...data.slice(index)];
console.log(inserted);

//Remove a value 4
const removed = data.filter( v => v !== 4 );
console.log(removed);

//Update a value 4 -> 16
const updated = data.map( v => v === 4 ? 16 : v );
console.log(updated); 

```

Javascript doesn't guarantee immutability, some libraries come handy:
- immutable
- immer
- mori 
