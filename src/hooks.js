import React, { useContext } from "react";
import WaitingContext from "./context";

function Wait(props) {
  const context = useContext(WaitingContext);
  return context.waiters.includes(props.on) ? props.fallback : props.children;
}

export function useWait() {
  const context = useContext(WaitingContext);
  return {
    ...context,
    Wait
  };
}

export function createWaitingContext(waiter) {
  const { isWaiting, startWaiting, endWaiting } = useContext(WaitingContext);
  return {
    isWaiting: () => isWaiting(waiter),
    startWaiting: () => startWaiting(waiter),
    endWaiting: () => endWaiting(waiter),
    Wait: props => <Wait on={waiter} {...props} />
  };
}
