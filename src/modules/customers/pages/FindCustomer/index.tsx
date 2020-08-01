import React, { useCallback, useState, useEffect, useRef } from 'react';

import { FiSearch } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import LayoutBusiness from '~/shared/components/LayoutBusiness';

import InputSearch from '~/shared/components/InputSearch';
import LinkCustom from '~/shared/components/LinkCustom';
import api from '~/shared/services/api';
import { useToast } from '~/shared/hooks/Toast';

import noAvatar from '~/shared/assets/no-avatar.png';
import { useAuth } from '~/shared/hooks/Auth';
import { useModal } from '~/shared/hooks/Modal';

import {
  Container,
  ContentSearch,
  BoxSearch,
  RowSearch,
  ImgSearch,
  InfoSearch,
  LinkH2,
  ButtonOptions,
  ButtonSearch,
  LinkSearch,
  Separator,
} from './styles';

interface Customer {
  id: string;
  name: string;
  cell_phone: number;
  email: string;
  birthDate: string;
  gender?: 'M' | 'W';
  cpf_or_cnpj?: number;
  avatar_url?: string;
  command: {
    id: string;
    business_id: string;
    number: string;
    command_closure_id?: string;
  }[];
  table_customer: {
    table: {
      id: string;
      business_id: string;
      number: string;
      table_closure_id: string;
    };
  }[];
  command_open: boolean;
  table_number?: string;
}

interface PropsSearch {
  customersInBusiness: Customer[];
  customersOutherBusiness: Omit<
    Customer,
    'cpf_or_cnpj' | 'command' | 'command_open'
  >[];
  users: Omit<Customer, 'cpf_of_cnpj' | 'command' | 'command_open'>[];
}

interface HandleCommandOrTable {
  customer: Customer;
  command_or_table: 'command' | 'table';
}

const FindCustomer: React.FC = () => {
  const { addToast } = useToast();
  const { business } = useAuth();
  const { addModal, responseModal, resetResponseModal } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [searchCustomers, setSearchCustomers] = useState<PropsSearch>(
    {} as PropsSearch,
  );

  const history = useHistory();

  const handleCommandOrTable = useCallback(
    ({
      customer: { id, avatar_url, name, command_open, table_number, command },
      command_or_table,
    }: HandleCommandOrTable) => {
      if (command_open && command_or_table === 'command') {
        const number_command = command.find(
          ({ business_id, command_closure_id }) =>
            business_id === business?.id && !command_closure_id,
        );

        history.push('business/close-command-or-table', {
          number: number_command?.number,
          command_or_table,
        });
      } else if (table_number && command_or_table === 'table') {
        history.push('business/close-command-or-table', {
          number: table_number,
          command_or_table,
        });
      } else {
        addModal({
          customer: {
            where: 'findCustomer',
            id,
            name,
            avatar_url: avatar_url || noAvatar,
            command_or_table,
          },
        });
      }
    },
    [addModal, history, business],
  );

  const handleSearch = useCallback((findCustomer: string) => {
    if (findCustomer.trim() !== '') {
      setSearch(findCustomer);
      setLoadingSearch(true);
    } else {
      setSearch('');
      setLoadingSearch(false);
      setSearchCustomers({} as PropsSearch);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== '') {
        api
          .get<PropsSearch>('customers/search', {
            params: {
              search,
            },
          })
          .then(({ data }) => {
            setSearchCustomers({
              customersOutherBusiness: data.customersOutherBusiness,
              users: data.users,
              customersInBusiness: data.customersInBusiness.map(customer => {
                const table_open = customer.table_customer.find(
                  ({ table }) =>
                    table.business_id === business?.id &&
                    !table.table_closure_id,
                );

                const table_number = table_open
                  ? table_open.table.number
                  : undefined;

                return {
                  ...customer,
                  command_open:
                    customer.command.filter(
                      findCommand =>
                        findCommand.business_id === business?.id &&
                        !findCommand.command_closure_id,
                    ).length > 0,
                  table_number,
                };
              }),
            });
          })
          .catch(() => {
            addToast({
              type: 'error',
              message: 'Opss... Encontramos um erro',
              description: 'Ocorreu um erro ao busca por cliente',
            });
          })
          .finally(() => {
            setLoadingSearch(false);
          });
      }
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [search, addToast, business]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (responseModal.action && responseModal.action === 'close_search') {
      setSearch('');
      setSearchCustomers({} as PropsSearch);
      resetResponseModal();
      inputRef.current?.focus();
    }
  }, [responseModal, resetResponseModal]);

  return (
    <LayoutBusiness pgActive="find-customer">
      <Container>
        <h1>Buscar por Clientes ou Usuários no goBar</h1>

        <InputSearch
          icon={FiSearch}
          inputRef={inputRef}
          valueSearch={search}
          handleSearch={handleSearch}
          placeholder="Busque pelo cliente em todo o goBar"
        />

        {loadingSearch ? (
          <span>searching...</span>
        ) : (
          <ContentSearch>
            {searchCustomers.customersInBusiness &&
              searchCustomers.customersInBusiness.length > 0 && (
                <>
                  <h1>Clientes em {business?.name}</h1>
                  <BoxSearch>
                    {searchCustomers.customersInBusiness.map(getCustomer => (
                      <RowSearch key={getCustomer.id}>
                        <ImgSearch>
                          <img
                            src={getCustomer.avatar_url || noAvatar}
                            alt={getCustomer.name}
                          />
                        </ImgSearch>

                        <InfoSearch>
                          <LinkH2 to={`/business/customer/${getCustomer.id}`}>
                            {getCustomer.name}
                          </LinkH2>
                          <ButtonOptions>
                            <ButtonSearch
                              type="button"
                              isRed={getCustomer.command_open ? 1 : 0}
                              onClick={() => {
                                handleCommandOrTable({
                                  customer: getCustomer,
                                  command_or_table: 'command',
                                });
                              }}
                            >
                              {getCustomer.command_open
                                ? 'Fechar Comanda'
                                : 'Abrir Comanda'}
                            </ButtonSearch>
                            <ButtonSearch
                              type="button"
                              isRed={getCustomer.table_number ? 1 : 0}
                              onClick={() => {
                                handleCommandOrTable({
                                  customer: getCustomer,
                                  command_or_table: 'table',
                                });
                              }}
                            >
                              {getCustomer.table_number
                                ? `Na mesa ${getCustomer.table_number}`
                                : 'Adicionar em Mesa'}
                            </ButtonSearch>
                            <ButtonSearch type="button">
                              Abrir Conta
                            </ButtonSearch>
                          </ButtonOptions>
                        </InfoSearch>
                      </RowSearch>
                    ))}
                  </BoxSearch>
                  {(searchCustomers.customersOutherBusiness.length > 0 ||
                    searchCustomers.users.length > 0) && <Separator />}
                </>
              )}

            {searchCustomers.customersOutherBusiness &&
              searchCustomers.customersOutherBusiness.length > 0 && (
                <>
                  <h1>Clientes em outros negócios</h1>
                  <BoxSearch>
                    {searchCustomers.customersOutherBusiness.map(
                      ({ id, name, avatar_url }) => (
                        <RowSearch key={id}>
                          <LinkSearch to={`/business/register-customer/${id}`}>
                            <ImgSearch>
                              <img src={avatar_url || noAvatar} alt={name} />
                            </ImgSearch>

                            <InfoSearch>
                              <h2>{name}</h2>
                              <span>Vincular cliente com {business?.name}</span>
                            </InfoSearch>
                          </LinkSearch>
                        </RowSearch>
                      ),
                    )}
                  </BoxSearch>
                  {searchCustomers.users.length > 0 && <Separator />}
                </>
              )}

            {searchCustomers.users && searchCustomers.users.length > 0 && (
              <>
                <h1>Usuários do goBar encontrados</h1>
                <BoxSearch>
                  {searchCustomers.users.map(({ id, name, avatar_url }) => (
                    <RowSearch key={id}>
                      <LinkSearch to="/business">
                        <ImgSearch>
                          <img src={avatar_url || noAvatar} alt={name} />
                        </ImgSearch>

                        <InfoSearch>
                          <h2>{name}</h2>
                          <span>Vincular usuário com {business?.name}</span>
                        </InfoSearch>
                      </LinkSearch>
                    </RowSearch>
                  ))}
                </BoxSearch>
              </>
            )}
          </ContentSearch>
        )}

        <LinkCustom to="/business/register-customer">
          Cadastrar novo Cliente
        </LinkCustom>

        {!loadingSearch && search === '' && (
          <p>
            Localizar cliente no goBar para vincular com <br />
            <strong>Bar da Léo</strong>.
          </p>
        )}
      </Container>
    </LayoutBusiness>
  );
};

export default FindCustomer;
