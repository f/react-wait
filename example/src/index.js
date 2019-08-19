import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { useWait, Waiter } from "react-wait";

import "./styles.css";

function Spinner() {
  return (
    <img
      className="spinner"
      alt="spinner"
      width="24"
      height="24"
      src="https://i.pinimg.com/originals/3e/f0/e6/3ef0e69f3c889c1307330c36a501eb12.gif"
    />
  );
}

function Sidebar() {
  const { Wait } = useWait();
  return (
    <div className="Sidebar">
      <Wait on="sidebar" fallback={<Spinner />}>
        This will go to loading state if <b>sidebar</b> loading is fired.
      </Wait>
    </div>
  );
}

function Header() {
  const { Wait } = useWait();
  return (
    <div className="Header">
      <Wait on="header" fallback={<Spinner />}>
        This will go to loading state if <b>header</b> loading is fired.
      </Wait>
    </div>
  );
}

function Footer() {
  const { Wait } = useWait();
  return (
    <div className="Footer">
      <Wait on="footer" fallback={<Spinner />}>
        This will go to loading state if <b>footer</b> loading is fired.
      </Wait>
    </div>
  );
}

function Main(props) {
  return <div className="Main">{props.children}</div>;
}

function App() {
  const [message, setMessage] = useState("sidebar");
  const { startWaiting, endWaiting, waiters } = useWait();

  useEffect(() => {
    startWaiting("sidebar");
  }, []);

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <Main>
        <p>Write "sidebar", "footer" or "header" to the message:</p>
        <input value={message} onChange={e => setMessage(e.target.value)} />
        <button onClick={() => startWaiting(message)}>Start Loading</button>
        <button onClick={() => endWaiting(message)}>End Loading</button>
        <hr />
        <p>The active waiters:</p>
        <pre>{JSON.stringify(waiters, null, 2)}</pre>
      </Main>
      <Footer />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Waiter>
    <App />
  </Waiter>,
  rootElement
);
