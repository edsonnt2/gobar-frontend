import React, { createContext, useCallback, useState, useContext } from 'react';
import ModalContainer from '../components/ModalContainer';

export interface CustomerData {
  id: string;
  name: string;
  avatar_url: string;
  where: 'findCustomer' | 'customer';
}

export interface ModalRequest {
  customer?: CustomerData;
  list_command?: boolean;
}

type ResponseRemoveModal = string | number;

interface ResponseModel {
  action?: 'close_search' | 'return_find_customer';
  response?: ResponseRemoveModal;
}

interface ModalContextData {
  addModal(data: ModalRequest): void;
  removeModal(response?: ResponseRemoveModal): void;
  responseModal: ResponseModel;
  resetResponseModal(): void;
}

const ModalContext = createContext<ModalContextData>({} as ModalContextData);

const ModalProvider: React.FC = ({ children }) => {
  const [dataModal, setDataModal] = useState<ModalRequest | undefined>(
    undefined,
  );
  const [responseModal, setResponseModal] = useState<ResponseModel>({});

  const addModal = useCallback((data: ModalRequest) => {
    setDataModal(data);
  }, []);

  const removeModal = useCallback((response?: ResponseRemoveModal) => {
    switch (response) {
      case 'findCustomer':
        setResponseModal({
          action: 'close_search',
        });
        break;
      case 'customer':
        setResponseModal({
          action: 'return_find_customer',
        });
        break;
      default:
        setResponseModal({
          response,
        });
        break;
    }

    setDataModal(undefined);
  }, []);

  const resetResponseModal = useCallback(() => {
    setResponseModal({});
  }, []);

  return (
    <ModalContext.Provider
      value={{ addModal, removeModal, responseModal, resetResponseModal }}
    >
      {children}
      <ModalContainer data={dataModal} />
    </ModalContext.Provider>
  );
};

const useModal = (): ModalContextData => {
  const context = useContext(ModalContext);

  if (!context)
    throw new Error('useModal must be used using within an ModalProvider');

  return context;
};

export { ModalProvider, useModal };
