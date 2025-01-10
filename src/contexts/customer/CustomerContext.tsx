import { createStoreContext } from '@/lib/context/createStoreContext';
import { CustomerState, CustomerContextValue } from './types';
import { useCallback } from 'react';

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
};

const [CustomerStoreProvider, useCustomerStore] = createStoreContext({
  name: 'Customer',
  initialState,
  persistKey: 'customer_state',
});

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  return <CustomerStoreProvider>{children}</CustomerStoreProvider>;
}

export function useCustomer(): CustomerContextValue {
  const [state, setState] = useCustomerStore();

  const addCustomer = useCallback(async (customerData: Omit<typeof state.customers[0], 'id'>) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      
      const newCustomer = {
        ...customerData,
        id: crypto.randomUUID(),
      };

      setState({
        ...state,
        customers: [newCustomer, ...state.customers],
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Erro ao adicionar cliente',
      });
    }
  }, [state, setState]);

  const updateCustomer = useCallback(async (id: string, data: Partial<typeof state.customers[0]>) => {
    try {
      setState({ ...state, isLoading: true, error: null });

      const updatedCustomers = state.customers.map(customer =>
        customer.id === id ? { ...customer, ...data } : customer
      );

      setState({
        ...state,
        customers: updatedCustomers,
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Erro ao atualizar cliente',
      });
    }
  }, [state, setState]);

  const deleteCustomer = useCallback(async (id: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });

      setState({
        ...state,
        customers: state.customers.filter(customer => customer.id !== id),
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Erro ao excluir cliente',
      });
    }
  }, [state, setState]);

  const selectCustomer = useCallback((customer: typeof state.selectedCustomer) => {
    setState({ ...state, selectedCustomer: customer });
  }, [state, setState]);

  return {
    ...state,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    selectCustomer,
  };
}