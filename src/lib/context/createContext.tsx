import React, { createContext, useContext } from 'react';

export interface CreateContextOptions {
  strict?: boolean;
  errorMessage?: string;
  name: string;
}

export type CreateContextReturn<T> = [React.Provider<T>, () => T, React.Context<T>];

export function createContextFactory<T>(options: CreateContextOptions = {
  strict: true,
  name: 'Context'
}) {
  const {
    strict = true,
    errorMessage,
    name,
  } = options;

  const Context = createContext<T | undefined>(undefined);

  Context.displayName = name;

  function useContextHook() {
    const context = useContext(Context);

    if (!context && strict) {
      const error = new Error(
        errorMessage ?? `use${name} must be used within a ${name}Provider`
      );
      error.name = 'ContextError';
      throw error;
    }

    return context as T;
  }

  return [Context.Provider, useContextHook, Context] as CreateContextReturn<T>;
}