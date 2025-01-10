import { useState, useCallback, useMemo } from 'react';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface Store<T> {
  get: () => T;
  set: (value: T | ((prev: T) => T)) => void;
  subscribe: (callback: (state: T) => void) => () => void;
}

export function createStore<T>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<(state: T) => void>();

  return {
    get: () => state,
    set: (nextState) => {
      state = typeof nextState === 'function'
        ? (nextState as (prev: T) => T)(state)
        : nextState;
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: Store<T>) {
  const [state, setState] = useState(store.get());

  useMemo(() => {
    return store.subscribe(setState);
  }, [store]);

  const set = useCallback(
    (value: T | ((prev: T) => T)) => {
      store.set(value);
    },
    [store]
  );

  return [state, set] as const;
}