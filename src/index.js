import React, { useState, useContext } from "react";
import { anyWaiting, isWaiting, startWaiting, endWaiting } from "./api";

const WaitingContext = React.createContext();

function Wait(props) {
  const context = useContext(WaitingContext);
  return context.waiters.includes(props.message)
    ? props.waiting
    : props.children;
}

export function Waiter(props) {
  const [waiters, setWaiters] = useState([]);

  return (
    <WaitingContext.Provider
      value={{
        waiters,
        createWaitingContext: waiter => ({
          isWaiting: () => isWaiting(waiters, waiter),
          startWaiting: () => setWaiters(startWaiting(waiters, waiter)),
          endWaiting: () => setWaiters(endWaiting(waiters, waiter)),
          Wait: (props) => (<Wait message={waiter} {...props}/>)
        }),
        anyWaiting: () => anyWaiting(waiters),
        isWaiting: waiter => isWaiting(waiters, waiter),
        startWaiting(waiter) {
          setWaiters(startWaiting(waiters, waiter));
        },
        endWaiting(waiter) {
          setWaiters(endWaiting(waiters, waiter));
        }
      }}
    >
      {props.children}
    </WaitingContext.Provider>
  );
}

export function useWait() {
  const context = useContext(WaitingContext);
  return {
    ...context,
    Wait
  };
}
