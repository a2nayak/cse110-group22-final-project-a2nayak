
# Frontend Conventions Guide

## About
This file is a guide containing the general conventions I have for consistent frontend development. Note that we are using a class component-based architecture, but we are *not* using native web components, as their syntax is verbose and hard to work with (in my opinion).

This guide will reference the sample webapp in `src/sample` as an example of how I generally expect things to be done in practice.

If you have any questions/feedback/suggestions, feel free to bring them up in the `#team-2` channel in Slack.

## Components

Broadly, components are a way to define the interactivity of our app in an encapsulated manner, while generally adhering to the semantics of HTML/CSS/JS. That is, HTML adds structure, CSS adds styles to HTML, and JS adds interactivity to HTML+CSS.

To achieve this goal, all components will have a root HTML template that they bind to. This template serves as the 'contract' for this component; it must be present in the HTML when the component is instantiated for it to function correctly. 

All components will lie in the `/components` directory, and will be named in PascalCase. Let's take a look at `/components/App.js` for an example of our first component.

We declare the component and mark it for export with
```js 
export default class App { 
``` 

The JSDocs for this component establishes the template the App component expects to function correctly.

```js 
/** 
 * The main component for the app.
 * 
 * Expects the following minimal HTML structure:
 * <div class="app">
 *   <div class="egg-group"></div>
 *   <EggCounter class="egg-counter"/>
 * </div>
 */
```

A few rules for these templates:
1. Templates must have a single root element (in this case, the `div` with class `app`)
2. If a template uses another component, mark the component with its name (e.g. `<EggCounter/>`)
3. Prefer using classes over IDs in templates
    1. This helps components stay reusable.

You will notice that this structure is present in our HTML file, as follows: 

```html
<!-- App -->
<div class="app">
  <!-- EggCounter -->
  <div class="egg-counter">
      <span class="egg-counter-text">Eggs: 0</span>
      <button class="egg-counter-decrement">-</button>
      <button class="egg-counter-increment">+</button>
  </div>

  <div class="egg-group"></div>
</div>
```

Templates are minimal requirements, so feel free to customize them however you like (e.g. adding more classes or styles).

Our App takes in a constructor, which binds the app to its root HTML element in our document. 

```js
/**
 * Binds this App to the given element.
 * @param {HTMLElement} element
 */
constructor(element) {
    this.element = element;
    this.eggGroupElement = assertHTMLElement(this.element.querySelector('.egg-group'));
    this.eggCounter = new EggCounter(assertHTMLElement(this.element.querySelector('.egg-counter')));
    this.eggCounter.onUpdateCount((newCount) => this.handleUpdateCount(newCount));
}
```

We call this constructor in our `ui.js` file to mount our app.

```js
/** @type {App} */
let app;
function main() {
    const appElement = assertHTMLElement(document.querySelector('.app'));
    app = new App(appElement);
}
document.addEventListener('DOMContentLoaded', main);
``` 

Alright, now we have our first component.


### Component Trees

Note that component classes can have other components as variables. For instance, `App` has an `EggCounter` subcomponent that it instantiates in its constructor.

```js
this.eggCounter = new EggCounter(assertHTMLElement(this.element.querySelector('.egg-counter')));
this.eggCounter.onUpdateCount((newCount) => this.handleUpdateCount(newCount));
```

This pattern of having components contain other subcomponents creates a component tree. Here is the component tree for our sample project.
![component tree](./assets/image.png)

There are a few conventions to keep in mind when working with component trees.
1. Component tree structure should match HTML structure.
    1. This is useful for encapsulation, but it also maintains code semanticity when root elements call `querySelector`.
2. State shared between a set of components should either (1) be global state or (2) be 'lifted' up to the least common ancestor of that set.
3. Information flow is regulated.
    1. Information going from parent $\to$  child should be passed through properties or child function calls (e.g. `child.doStuff()`)
    2. Information going from child $\to$ parent should be passed through callbacks (e.g. parent calls `child.onClick(callback)`)

### Reactivity

We want components to be *reactive*. That is, changing their properties or calling their public functions will keep the component in a valid state.

As an example, running

```js
eggCounter.count++
```
should automatically rerender the component to change its display text without needing to do anything else. 

This behavior can be achieved by leveraging JS getter and setter functionality. We can look at the code for `eggCounter` to see an example of this.

```js
/**
 * Sets the current egg count and updates the display.
 * @param {number} newCount
 */
set count(newCount) {
    this.#count = newCount;
    this.counterText.textContent = `Eggs: ${this.#count}`;
}
```

We mark the backing field of this component, `#count`, as a natively private JS variable to hide it. Then, the setter is able to update `#count` and change the displayed text at the same time, maintaining reactivity.

The basic convention here that all public properties and methods should be reactive, and all private properties and methods may not necessarily be reactive. Note that we are using JSDoc annotations to mark properties as public/private.

