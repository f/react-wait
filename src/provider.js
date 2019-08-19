import React, { useState } from "react";
import { anyWaiting, isWaiting, startWaiting, endWaiting } from "./api";
import { createWaitingContext } from "./hooks";
import WaitingContext from "./context";

export function Waiter(props) {
  const [waiters, setWaiters] = useState([]);

  return (
    <WaitingContext.Provider
      value={{
        waiters,
        createWaitingContext,
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

export default Waiter;
