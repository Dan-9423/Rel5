import { createContextFactory } from './createContext';
import { createStore, Store, useStore } from './createStore';

interface CreateStoreContextOptions<T> {
  name: string;
  initialState: T;
  persistKey?: string;
}

export function createStoreContext<T>({
  name,
  initialState,
  persistKey,
}: CreateStoreContextOptions<T>) {
  // Load persisted state if available
  const loadPersistedState = () => {
    if (persistKey) {
      try {
        const savedState = localStorage.getItem(persistKey);
        if (savedState) {
          return JSON.parse(savedState) as T;
        }
      } catch (error) {
        console.error(`Error loading persisted state for ${name}:`, error);
      }
    }
    return initialState;
  };

  const store = createStore<T>(loadPersistedState());

  // Setup persistence
  if (persistKey) {
    store.subscribe((state) => {
      try {
        localStorage.setItem(persistKey, JSON.stringify(state));
      } catch (error) {
        console.error(`Error persisting state for ${name}:`, error);
      }
    });
  }

  const [Provider, useContext] = createContextFactory<Store<T>>({
    name,
    strict: true,
  });

  function StoreProvider({ children }: { children: React.ReactNode }) {
    return <Provider value={store}>{children}</Provider>;
  }

  function useStoreContext() {
    const store = useContext();
    return useStore(store);
  }

  return [StoreProvider, useStoreContext] as const;
}