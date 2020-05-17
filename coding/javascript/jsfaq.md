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


