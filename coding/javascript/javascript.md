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
this keyword behaves different from this in other languages like C++ or Java. this in javascript depends on where it is used. 

```javascript
const person = {
    name: "Yue",
    walk() {
        console.log(this);
    }
};

// this is like normal c++ this, it points to the object
person.walk();
//Output: {name: "Yue", walk: ƒ}

// this points to global DOM window, which is default behavior 
const walk = person.walk;
walk();
//Output: {parent: Window, opener: null, top: Window, length: 4, frames: Window, …}

// To avoid the problem, use javascript function bind, which sets this
const boundWalk = person.walk.bind(person);
boundWalk();
//Output: {name: "Yue", walk: ƒ}
```

What if we use arrow function? Arrow function in javascript won't rebind this keyword. In the above case, we can refactor it:

```javascript
const person = {
  name: "Yue",
  walk() {
    self = this;
    setTimeout( () => console.log(this), 1000);
  }
};

const walk = person.walk;
walk();
//Output: {name: "Yue", walk: ƒ}
```

## Template literal
Template literals are string literals allowing embedded expressions. You can use multi-line strings and string interpolation features with them.

They were called "template strings" in prior editions of the ES2015 specification.

```
colors = ['red', 'blue', 'green'];
colors.map( color => `<li>${color}</li>`);
//Output: ["<li>red</li>", "<li>blue</li>", "<li>green</li>"]
```

## Destructing

```
const address = {
  street: "ethel street",
  city: "rolling hills",
  state: "california",
  country: "usa"
}

/*
const street = address.street;
const city = address.city;
*/
const {street, city} = address;

// alias country to nation
const {country: nation } = address
```

## classes

```
class Person {
  constructor(name) {
    this.name = name;
  }

  walk() {
    console.log( `${this.name} walks the walk` );
  }

  talk() {
    console.log( `${this.name} talks the talk` );
  }
}

const yue = new Person("Yue");
yue.talk();
yue.walk();
```

### Inheritance
```
class Teacher extends Person {
  constructor(name, grade) {
    super(name);
    this.grade = grade;
  }

  teach() {
    console.log( `${this.name} teachs the grade ${this.grade}` );
  }
}

const dino = new Teacher('dino', 3);
dino.walk();
dino.teach();
```

## spread operator
Spread operator can apply to both lists and objects.

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

## modules
A js file is a module, which can be imported in other modules.

Usually an object in a module isn't visible outside. To make it public, use export key words:
export public function or objects
- default export if only one exported object: ```export default <object>```
- named export if multiple exported object: ```export <object>```

import function, classes, or objects
- For named exports, need {}: ```import { <object> } from <module>``` 
- For default export, no need for {}: ```import <object> from <module>```

```
//module 1: Person.js
export class Person() {}

//module 2: Teacher.js
import { Person } from './Person";

export default class Teacher extends Person {}

//module 3: main.js
import Teacher from './Teacher';

const dino = new Teacher("Dino", 3);
dino.walk();
dino.teach();
```
