import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
  avatar: string;
}

interface UserContextType {
  user: User;
  updateUser: (data: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao.silva@exemplo.com',
    phone: '(11) 98765-4321',
    role: 'Administrador',
    gender: localStorage.getItem('userGender') || 'male',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  const updateUser = (data: Partial<User>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};