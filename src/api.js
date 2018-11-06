export const anyWaiting = waiters => waiters.length > 0;

export const isWaiting = (waiters, waiter) => waiters.includes(waiter);

export const startWaiting = (waiters, waiter) => {
  if (isWaiting(waiters, waiter)) return waiters;
  return [...waiters, waiter];
};

export const endWaiting = (waiters, waiter) => {
  return waiters.filter(w => w !== waiter);
};
