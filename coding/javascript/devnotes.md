# Basics

A list of basic concepts for ReactJS:
- [JSX basics](#jsx-basics)
- [rendering](#rendering) 
- [Components and Props](#components-and-props)
- [State and Lifecycle](#state-and-lifecycle)
- [Handling Events](https://reactjs.org/docs/handling-events.html)
- [Conditional Rendering](https://reactjs.org/docs/conditional-rendering.html)
- [Lists and Keys](https://reactjs.org/docs/lists-and-keys.html)
- [Forms](https://reactjs.org/docs/forms.html)
- [Lifting State Up](https://reactjs.org/docs/lifting-state-up.html)
- [Composition vs Inheritance](https://reactjs.org/docs/composition-vs-inheritance.html)
- [Thinking In React](https://reactjs.org/docs/thinking-in-react.html)
- [Context](#context)
- [Higher order components](#higher-order-components)
- [Render props](#render-props)
- [Refs](#refs)
- [Error boundaries](#error-boundaries)
- [HTTP requests](#http-requests)
- [React hooks](#react-hooks)

# JSX basics

[Reference](https://reactjs.org/docs/introducing-jsx.html)

JSX is a syntax extension to Javascript, which produces React "elements". In JSX, put any valid JavaScript expression inside the curly braces in JSX. 

JSX addresses the fact that rendering logic is coupled with other UI logic: event handling, state changes, and data.

```javascript
// Define data
const user_joe = {
  firstName: "Joseph",
  lastName: "Biden"
};

// Defined element to render
function Greeting(user) {
    return (<h1> Hi, {user.firstName} {user.lastName}!</h1>);
}
//const joe = <Greeting firstName={user_joe.firstName} lastName={user_joe.lastName} /> 
ReactDOM.render(Greeting(user_joe), document.getElementById('root'));
```
When spliting JSX over multiple lines for readability, it is recommended wrapping it in parentheses to avoid the pitfalls of automatic semicolon insertion

After compilation, JSX expressions become regular JavaScript function calls and evaluate to JavaScript objects, which means that developers can use JSX inside of if statements and for loops, assign it to variables, accept it as arguments, and return it from functions.

# rendering

[Reference](https://reactjs.org/docs/rendering-elements.html) 

Rendering takes 3 steps:
- Create an element (1) in HTML for rendering
- Create an element (2) to be rendered to the HTML element
- Call ReactDOM.render to insert (2) into (1)

For the example in JSX basics, the html is defined as
```html
<html>
<div id="root" />
</html>
```

React elements are immutable, to update the content, update the element, and ReactDOM will handle the change
```
function tick() {
  const element = (
    <div>
      <h1>Hello world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
```

# Components and props

[Reference](https://reactjs.org/docs/components-and-props.html)

A component should never change its props, with the same input, output is the same (pure function).
**All React components must act like pure functions with respect to their props.**

There are 2 ways to define a component:
- Define a function
- Extend a class from React.Component, and implement its render() function. Input parameters are passed in this.props object.

```javascript
function Greeting(user) {
  return <li>Welcome, {user.firstName} {user.lastName}</li>
}

class Greeting extends React.Component {
  render() {
    return <li>Welcome, {this.props.firstName} {this.props.lastName}</li>
  }
}
```
The usage is the same, both function and class name can be used as element name, with attributes as input parameter (props), user defined components.

With components, we can compose more complicated UI by referring to other components (predefined or user defined). For example, a list of greetings:
```javascript
function All() {
  return (<ul>
      <Greeting firstName="Joe" lastName="Biden"/>
      <Greeting firstName="Sarah" lastName="Biden"/>
      <Greeting firstName="Doug" lastName="Biden"/>
      <Greeting firstName="Eva" lastName="Biden"/>
    </ul>);
}

ReactDOM.render( <All />, document.getElementById('root'));
```

Given the composition, we can restructure a nesting UI component into a structured architecture:
```javascript
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

From the HTML layers, we can find 3 layers: 
- Comment
  1. UserInfo
    - Avatar
    - UserInfoName
  2. CommentText
  3. CommentDate

```javascript
function formatDate(date) {
  return date.toLocaleDateString();
}

function Avatar(props) {
    return <img src={props.author.avatarUrl} alt={props.author.name} />;
}

function UserInfoName(props) {
    return (<div className="Userinfo-name">{props.user.name}</div>);
}

function CommentText(props) {
    return (<div className="Comment-text">{props.text}</div>);
}

function CommentDate(props) {
    return (<div className="Comment-date">{formatDate(props.date)}</div>);
}

function UserInfo(props) {
    return (<div className="UserInfo">
                <Avatar author={props.author} />
                <UserInfoName user={props.author} />
           </div>);
}

function Comment(props) {
    return (<div> 
        <UserInfo author ={props.author} /> 
        <CommentText text = {props.text} />
        <CommentDate date = {props.date} />
      </div>);
}

const author_yue = {
  avatarUrl: "https://cdn1.thr.com/sites/default/files/imagecache/768x433/2019/03/avatar-publicity_still-h_2019.jpg",
  name: "Yue"
};

const date_now = new Date();

ReactDOM.render(
  <Comment author= {author_yue} date={date_now} text="whatever it is" />,
  document.getElementById('root')
);
```

## State and Lifecycle

[Reference](https://reactjs.org/docs/state-and-lifecycle.html)

State is similar to props, but it is private and fully controlled by the component.

Example to show clock with function
```
function Clock(props) {
  return (
    <div>
      <h2>Time: {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

To convert the above example with state, we need to:
- change it from function to class
- Add a constructor, and initiaite this.state.date
- render the state.date 

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()}; //initiate state.date
  }

  render() {
    return (
      <div>
        <h2>Time: {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }

  //Lifecycle methods
  componentDidMount() {
    this.timerID = setInterval( () => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // Utility function to set state
  tick() {
    this.setState( { date: new Date() });
  }
}

function All() {
  return (<div>
    <Clock />
    <Clock />
    <Clock />
  </div>);
}
ReactDOM.render(
  <All />,
  document.getElementById('root')
);
```
Notes about the state:
- Don't set state.date explicitly: this.state.date = new Date(), instead use this.setState({date: new Date()}).
  The only place assign this.state is the constructor
- State update may be asynchronous, therefore pass in the parameters
  this.setState( (state, props) => ... );
- State update are merged
- Data flows down

## Handling Events

[Reference](https://reactjs.org/docs/handling-events.html)

## Conditional Rendering

[Reference](https://reactjs.org/docs/conditional-rendering.html)

## Lists and Keys

[Reference](https://reactjs.org/docs/lists-and-keys.html)

## Forms

[Reference](https://reactjs.org/docs/forms.html)

## Lifting State Up

[Reference](https://reactjs.org/docs/lifting-state-up.html)

## Composition vs Inheritance

[Reference](https://reactjs.org/docs/composition-vs-inheritance.html)

## Thinking In React

[Reference](https://reactjs.org/docs/thinking-in-react.html)

## Context

[Reference](#)

## Higher order components

[Reference](#)

## Render props

[Reference](#)

## Refs

[Reference](#)

## Error boundaries

[Reference](#)

## HTTP requests

[Reference](#)

## React hooks

[Reference](#)
