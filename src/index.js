import React, { useState, useContext } from "react";

const WaitingContext = React.createContext([]);

function Wait(props) {
  const context = useContext(WaitingContext);
  return context.waiters.includes(props.message)
    ? props.waiting
    : props.children;
}

export function Waiter(props) {
  const [waiters, setWaiters] = useState(useContext(WaitingContext));
  return (
    <WaitingContext.Provider
      value={{
        waiters,
        anyWaiting() {
          return waiters.length > 0;
        },
        isWaiting(waiter) {
          return waiters.includes(waiter);
        },
        start(waiter) {
          if (waiters.includes(waiter)) return waiters;
          const newWaiters = [...waiters, waiter];
          setWaiters(newWaiters);
        },
        end(waiter) {
          setWaiters(waiters.filter(l => l !== waiter));
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
