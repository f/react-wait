import React, { useState, useContext } from "react";

const WaitingContext = React.createContext([]);

function Wait(props) {
  const context = useContext(WaitingContext);
  return context.waiters.includes(props.message)
    ? props.waiting
    : props.children;
}

export const anyWaiting = waiters => waiters.length > 0;

export const isWaiting = (waiters, waiter) => waiters.includes(waiter);

export const start = (waiters, waiter) => {
  if (isWaiting(waiters, waiter)) return waiters;
  return [...waiters, waiter];
};

export const end = (waiters, waiter) => {
  if (!isWaiting(waiters, waiter)) return waiters;
  return waiters.filter(l => l !== waiter);
};

export function Waiter(props) {
  const [waiters, setWaiters] = useState(useContext(WaitingContext));
  return (
    <WaitingContext.Provider
      value={{
        waiters,
        anyWaiting: () => anyWaiting(waiters),
        isWaiting: waiter => isWaiting(waiters, waiter),
        start(waiter) {
          setWaiters(start(waiters, waiter));
        },
        end(waiter) {
          setWaiters(end(waiters, waiter));
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
