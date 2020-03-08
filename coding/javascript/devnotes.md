# Basics

A list of basic concepts for ReactJS:
- [JSX basics](https://reactjs.org/docs/introducing-jsx.html)
- [rendering](https://reactjs.org/docs/rendering-elements.html) 
- [Components and Props](https://reactjs.org/docs/components-and-props.html)
- [State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)
- [Handling Events](https://reactjs.org/docs/handling-events.html)
- [Conditional Rendering](https://reactjs.org/docs/conditional-rendering.html)
- [Lists and Keys](https://reactjs.org/docs/lists-and-keys.html)
- [Forms](https://reactjs.org/docs/forms.html)
- [Lifting State Up](https://reactjs.org/docs/lifting-state-up.html)
- [Composition vs Inheritance](https://reactjs.org/docs/composition-vs-inheritance.html)
- [Thinking In React](https://reactjs.org/docs/thinking-in-react.html)

# JSX basics

JSX is a syntax extension to Javascript, which produces React "elements". 

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

# rendering

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
