export const anyWaiting = waiters => waiters.size > 0;

export const isWaiting = (waiters, waiter) => waiters.has(waiter);

export const startWaiting = (waiters, waiter) => {
  waiters.add(waiter);
  return waiters;
};

export const endWaiting = (waiters, waiter) => {
  waiters.delete(waiter);
  return waiters;
};
