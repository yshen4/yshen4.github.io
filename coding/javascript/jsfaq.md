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

// See variable name
console.trace('Log with variable names');
console.log( {dog, cat, lizard} );

// A better way is to see it in a table
console.trace('Log in a table');
console.table( {dog, cat, lizard} );

// End a timer
console.timeEnd('timer_check');
```
