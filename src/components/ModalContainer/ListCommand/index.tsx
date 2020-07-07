import React, { useCallback, useRef, useState, useEffect } from 'react';

import { FiXCircle, FiSearch } from 'react-icons/fi';

import {
  Container,
  CloseCommand,
  ImgCustomer,
  InfoCustomer,
  ListCommands,
  RowCommand,
} from './styles';

import { useModal } from '../../../hooks/Modal';
import api from '../../../services/api';
import { useToast } from '../../../hooks/Toast';
import InputSearch from '../../InputSearch';
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
    avatar_url: string;
  };
}

const ListCommand: React.FC<Props> = ({ style }) => {
  const { addToast } = useToast();
  const { removeModal } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const [LoadingSearch, setLoadingSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);

  const loadCustomers = useCallback(async () => {
    try {
      const response = await api.get('commands');
      setCustomers(response.data);
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
          .get('commands/search', {
            params: {
              search,
            },
          })
          .then(({ data }) => {
            setCustomers(data);
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
        placeholder="Busque pela Comanda ou Cliente"
      />

      {LoadingSearch ? (
        'loading...'
      ) : (
        <ListCommands>
          {customers.map(({ id, number, customer }) => (
            <RowCommand key={id} onClick={() => handleClick(number)}>
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
