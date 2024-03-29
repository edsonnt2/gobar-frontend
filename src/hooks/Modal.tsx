import { createContext, useCallback, useState, useContext } from 'react';

import { Modals } from '@/components';

export interface CustomerData {
  id: string;
  name: string;
  avatar_url: string;
  where: 'findCustomer' | 'customer';
  command_or_table: 'command' | 'table';
}

export interface MakeyPayData {
  type: 'command' | 'table' | 'account';
  close_id: string[];
  value_total: number;
}

export type PlaceTable = 'close' | 'launch';

export interface ModalRequest {
  customer?: CustomerData;
  list_tables?: PlaceTable;
  list_commands?: boolean;
  make_pay?: MakeyPayData;
}

type ResponseRemoveModal = string | number;

interface ResponseModel {
  action?: 'close_search' | 'return_find_customer' | 'close_list';
  response?: ResponseRemoveModal;
}

interface ModalContextData {
  addModal(data: ModalRequest): void;
  removeModal(response?: ResponseRemoveModal): void;
  responseModal: ResponseModel;
  resetResponseModal(): void;
}

const ModalContext = createContext({} as ModalContextData);

const ModalProvider: React.FC = ({ children }) => {
  const [dataModal, setDataModal] = useState<ModalRequest | undefined>(undefined);
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
    <ModalContext.Provider value={{ addModal, removeModal, responseModal, resetResponseModal }}>
      {children}
      <Modals data={dataModal} />
    </ModalContext.Provider>
  );
};

const useModal = (): ModalContextData => {
  return useContext(ModalContext);
};

export { ModalProvider, useModal };
