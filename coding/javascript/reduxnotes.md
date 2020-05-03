# Basics

## Functional programming

Functional programming is the process of building software by composing pure functions, avoiding shared state, mutable data, and side-effects. Functional programming is declarative rather than imperative, and application state flows through pure functions.

```javascript
let data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const isEven = data.map( n => n % 2 == 0 );
const odds = data.filter( n => n % 2 != 0 );
const total = data.reduce( (sum, n) => sum += n, 0 );
```

