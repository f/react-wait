<p align="center">
<img src="./resources/logo.png" width="500">
</p>
<p align="center">
 Multiple Loader Management for <a href="http://reactjs.org/" rel="nofollow" class="rich-diff-level-one">React</a>.
</p>

<p align="center">
 <strong class="rich-diff-level-one">Read the <a href="https://medium.com/@fkadev/managing-complex-waiting-experiences-on-web-uis-29534d2d92a8" rel="nofollow">Medium post "Managing Complex Waiting Experiences on Web UIs"</a>.</strong>
</p>

[![npm version](https://badge.fury.io/js/use-wait.svg)](https://badge.fury.io/js/use-wait)

---

> [Play with Demo](https://codesandbox.io/s/pmp3w1om17).

**use-wait** isa **React Hook** helps to manage multiple loading states on the page without any conflict. It's based on a **very simple idea** that manages an array with multiple loading states. The **built-in loader component** listens its registered loader and immediately become loading state.

# Quick Start

If you are a **try and learn** developer, you can start trying the **use-wait** now using [codesandbox.io](https://codesandbox.io).

[![Edit useWait](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/pmp3w1om17)

### 1. Install:
```bash
yarn add use-wait
```

### 2. Require:

```jsx
import { Waiter, useWait } from 'use-wait'

function UserCreateButton() {
  const { start, end, isWaiting, Wait } = useWait();

  return (
    <button
      onClick={() => start("creating user")}
      disabled={isWaiting("creating user")}
    >
      <Wait message="creating user" waiting={<div>Creating user!</div>}>
        Create User
      </Wait>
    </button>
  );
}
```

And you should wrap your `App` with `Waiter` component. It's actually a `Context.Provider` that provides a loading context to the component tree.

```jsx
const rootElement = document.getElementById("root");
ReactDOM.render(
  <Waiter>
    <App />
  </Waiter>,
  rootElement
);
```

## 🔧 Installation

```bash
$ yarn add use-wait
# or if you using npm
$ npm install use-wait
```
## 🌈 The API

**use-wait** provides some helpers to you to use in your templates.

#### `isWaiting(waiter String)`

Returns boolean value if any loader exists context.

```jsx
const { isWaiting } = useWait();

return <button disabled={isWaiting('message')}>Disabled while </button>;
```

#### `start(waiter String)`

Starts the given waiter.

```jsx
const { start } = useWait();

return <button onClick={() => start('message')}>Start</button>;
```

#### `end(waiter String)`

Stops the given waiter.

```jsx
const { end } = useWait();

return <button onClick={() => end('message')}>Stop</button>;
```

## 💧 Using `Wait` Component

```jsx
function Component() {
  const { Wait } = useWait();
  return <Wait
    message="the waitin g message"
    waiting={<div>Waiting...</div>}
    >
    The content after waiting done
  </Wait>
}
```

Better example for a `button` with loading state:

```jsx
<button disabled={isWaiting('creating user')}>
  <Wait
    messgage='creating user'
    waiting={<div>Creating User...</div>}>
    Create User
  </Wait>
</button>
```

## ⚡️ Making Reusable Loader Components

With reusable loader components, you will be able to use custom loader components as example below. This will allow you to create better **user loading experience**.

```jsx
function Spinner() {
  return <img src="spinner.gif"/>;
}
```

Now you can use your spinner everywhere using `waiting` attribute:

```jsx
<button disabled={isWaiting('creating user')}>
  <Wait
    messgage='creating user'
    waiting={<Spinner/>}>
    Create User
  </Wait>
</button>
```

## 🎯 Contributors

 - Fatih Kadir Akın, (creator)

## 🔗 Other Implementations

Since **use-wait** based on a very simple idea, it can be implemented on other frameworks.

 - [vue-wait](https://github.com/f/vue-wait): Multiple Process Loader Management for Vue.
 - [dom-wait](https://github.com/f/dom-wait): Multiple Process Loader Management for vanilla JavaScript.

## 🔑 License

MIT © [Fatih Kadir Akın](https://github.com/f)
