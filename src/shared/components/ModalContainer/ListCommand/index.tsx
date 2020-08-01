import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  KeyboardEvent,
} from 'react';

import { FiXCircle, FiSearch } from 'react-icons/fi';

import {
  Container,
  CloseCommand,
  ImgCustomer,
  InfoCustomer,
  ListCommands,
  RowCommand,
} from './styles';

import { useModal } from '~/shared/hooks/Modal';
import api from '~/shared/services/api';
import { useToast } from '~/shared/hooks/Toast';
import InputSearch from '~/shared/components/InputSearch';
import noAvatar from '../../../assets/no-avatar.png';

interface Props {
  style: object;
}

interface Customer {
  id: string;
  number: number;
  customer: {
    id: string;
    name: string;
    user?: {
      avatar_url?: string;
    };
    avatar_url?: string;
  };
}

const ListCommand: React.FC<Props> = ({ style }) => {
  const { addToast } = useToast();
  const { removeModal } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const [LoadingSearch, setLoadingSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cursor, setCursor] = useState(-1);

  const loadCustomers = useCallback(async () => {
    try {
      const response = await api.get<Customer[]>('commands');
      setCustomers(
        response.data.map(customer => ({
          ...customer,
          customer: {
            ...customer.customer,
            ...(customer.customer.user?.avatar_url && {
              avatar_url: customer.customer.user.avatar_url,
            }),
          },
        })),
      );
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Opss.. Encontramos um erro',
        description:
          'Ocorreu um erro ao tentar listar as comandas abertas, por favor, tente novamente !',
      });
    } finally {
      setLoadingSearch(false);
    }
  }, [addToast]);

  const handleSearch = useCallback((findCustomer: string) => {
    setLoadingSearch(true);
    if (findCustomer.trim() !== '') {
      setSearch(findCustomer);
    } else {
      setSearch('');
      setCustomers([]);
    }
  }, []);

  const handleClick = useCallback(
    (number: number) => {
      removeModal(number);
    },
    [removeModal],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13 && customers.length > 0 && cursor > -1) {
        handleClick(customers[cursor].number);
      } else if (e.keyCode === 38 && cursor >= 0) {
        setCursor(cursor - 1);
      } else if (e.keyCode === 40 && cursor < customers.length - 1) {
        setCursor(cursor + 1);
      }
    },
    [cursor, customers, handleClick],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== '') {
        api
          .get<Customer[]>('commands/search', {
            params: {
              search,
            },
          })
          .then(({ data }) => {
            setCustomers(
              data.map(customer => ({
                ...customer,
                customer: {
                  ...customer.customer,
                  ...(customer.customer.user?.avatar_url && {
                    avatar_url: customer.customer.user.avatar_url,
                  }),
                },
              })),
            );
          })
          .catch(() => {
            addToast({
              type: 'error',
              message: 'Opss... Encontramos um erro',
              description:
                'Ocorreu um erro ao busca por comandas cadastradas, por favor, tente novamente !',
            });
          })
          .finally(() => {
            setLoadingSearch(false);
          });
      } else {
        loadCustomers();
      }
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [search, addToast, loadCustomers]);

  return (
    <Container style={style}>
      <h1>Comandas Abertas</h1>

      <CloseCommand type="button" onClick={() => removeModal()}>
        <FiXCircle size={28} />
      </CloseCommand>

      <InputSearch
        icon={FiSearch}
        inputRef={inputRef}
        valueSearch={search}
        handleSearch={handleSearch}
        onKeyDown={handleKeyDown}
        placeholder="Busque pela Comanda ou Cliente"
      />

      {LoadingSearch ? (
        'loading...'
      ) : (
        <ListCommands>
          {customers.map(({ id, number, customer }, index) => (
            <RowCommand
              key={id}
              onClick={() => handleClick(number)}
              hasSelected={cursor === index}
            >
              <ImgCustomer>
                <img
                  src={customer.avatar_url || noAvatar}
                  alt={customer.name}
                />
              </ImgCustomer>
              <InfoCustomer>
                <h2>{customer.name}</h2>
                <span>
                  Comanda: <strong>{number}</strong>
                </span>
              </InfoCustomer>
            </RowCommand>
          ))}
        </ListCommands>
      )}
    </Container>
  );
};

export default ListCommand;
