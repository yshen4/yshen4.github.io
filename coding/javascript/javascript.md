# Javascript essentials

## let/const/var
var defines a variable with the scope of a function, while let/const is in the block
```javascript
function sayI(n) {
    for (var i = 0; i < n; ++i) {
        console.log(i);
    }
    console.log(i);
}

sayI(5); //0, 1, 2, 3, 4, 5

function sayL(n) {
    for (let i = 0; i < n; ++i) {
        console.log(i);
    }
    //Error: Uncaught ReferenceError: i is not defined
    //console.log(i);
}
```

## Objects

2 ways to define an object:
```
const person = {
  name: 'Yue',
  talk: function() { console.log( "talk the talk" ); },
  walk: function() { console.log( "walk the walk" ); }
};

person.talk();
person.walk();

const newPerson = {
  name: 'Yue',
  talk() { console.log( "talk the talk" ); },
  walk() { console.log( "walk the walk" ); }
};

newPerson.talk();
newPerson.walk();
  
```

## this

## classes

## destructing

## arrow functions

## spread

## modules
