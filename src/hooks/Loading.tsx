import { createContext, useCallback, useState, useContext } from 'react';

import { Spinner } from '@/components';

interface LoadingContextData {
  setLoading(loading: boolean): void;
}

const LoadingContext = createContext({} as LoadingContextData);

const LoadingProvider: React.FC = ({ children }) => {
  const [spinner, setSpinner] = useState(false);

  const setLoading = useCallback((loading: boolean) => {
    setSpinner(loading);
  }, []);

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      {spinner && <Spinner />}
    </LoadingContext.Provider>
  );
};

const useLoading = (): LoadingContextData => {
  return useContext(LoadingContext);
};

export { LoadingProvider, useLoading };
