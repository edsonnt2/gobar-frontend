import { createContext, useCallback, useState, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  type?: 'info' | 'success' | 'error';
  message: string;
  description?: string;
}

interface ToastContextData {
  addToast(messages: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(({ type, message, description }: Omit<ToastMessage, 'id'>) => {
    const id = uuid();

    const toast = {
      id,
      type,
      message,
      description,
    };

    setMessages(prevMessage => [...prevMessage, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

const useToast = (): ToastContextData => {
  return useContext(ToastContext);
};

export { ToastProvider, useToast };
