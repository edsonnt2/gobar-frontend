import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface SignInData {
  cellPhoneOrEmail: string;
  password: string;
}

interface User {
  id: string;
  full_name: string;
  cell_phone: number;
  email: string;
  birthDate: string;
  avatar_url: string;
}

interface Business {
  id: string;
  name: string;
  avatar_url: string;
}

interface LocalStorageData {
  user: User;
  business?: Business;
  token: string;
}

interface AuthContextData {
  user: User;
  business?: Business;
  signIn(credentials: SignInData): Promise<void>;
  saveAuth(data: LocalStorageData): void;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<LocalStorageData>(() => {
    const token = localStorage.getItem('@goBar:token');
    const user = localStorage.getItem('@goBar:user');
    const business = localStorage.getItem('@goBar:business');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return {
        user: JSON.parse(user),
        token,
        ...(business && { business: JSON.parse(business) }),
      };
    }
    return {} as LocalStorageData;
  });

  const signIn = useCallback(
    async ({ cellPhoneOrEmail, password }: SignInData) => {
      const {
        data: { user, token },
      } = await api.post('sessions', { cellPhoneOrEmail, password });

      localStorage.setItem('@goBar:token', token);
      localStorage.setItem('@goBar:user', JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ user, token });
    },
    [],
  );

  const saveAuth = useCallback(
    ({ user, token, business }: LocalStorageData) => {
      localStorage.setItem('@goBar:token', token);
      localStorage.setItem('@goBar:user', JSON.stringify(user));

      if (business)
        localStorage.setItem('@goBar:business', JSON.stringify(business));

      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ user, token, business });
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@goBar:token');
    localStorage.removeItem('@goBar:user');
    localStorage.removeItem('@goBar:business');
    setData({} as LocalStorageData);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        business: data.business,
        saveAuth,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuth must be used using within an AuthProvider');

  return context;
};

export { AuthProvider, useAuth };
