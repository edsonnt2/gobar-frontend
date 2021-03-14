import { useCallback, useState, useEffect, useRef } from 'react';

import { FiSearch } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import LayoutBusiness from '@/components/LayoutBusiness';
import InputSearch from '@/components/InputSearch';
import LinkCustom from '@/components/LinkCustom';

import { useAuth } from '@/hooks/Auth';
import { useModal } from '@/hooks/Modal';
import { useToast } from '@/hooks/Toast';

import noAvatar from '@/assets/no-avatar.png';

import BoxSearch from '../../components/BoxSearch';

import { Container, ContentSearch, Separator } from './styles';
import CustomerService, { Customer, SearchCostumer } from '../../services/CustomerService';

interface HandleCommandOrTable {
  customer: Customer;
  command_or_table: 'command' | 'table';
}

const FindCustomer: React.FC = () => {
  const history = useHistory();

  const { addToast } = useToast();
  const { business } = useAuth();
  const { addModal, responseModal, resetResponseModal } = useModal();

  const inputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchCustomers, setSearchCustomers] = useState({} as SearchCostumer);

  const handleCommandOrTable = useCallback(
    ({
      customer: { id, avatar_url, name, command_open, table_number, command },
      command_or_table,
    }: HandleCommandOrTable) => {
      if (command_open && command_or_table === 'command') {
        const number_command = command.find(
          ({ business_id, command_closure_id }) => business_id === business?.id && !command_closure_id,
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
    if (findCustomer?.trim()) {
      setSearch(findCustomer);
      setLoadingSearch(true);
    } else {
      setSearch('');
      setLoadingSearch(false);
      setSearchCustomers({} as SearchCostumer);
    }
  }, []);

  const handleSearchCustomers = useCallback(
    async (find: string) => {
      try {
        const { customersOtherBusiness, customersInBusiness, users } = await CustomerService.searchCostumer(find);

        setSearchCustomers({
          customersOtherBusiness,
          users,
          customersInBusiness: customersInBusiness.map(customer => {
            const table_open = customer.table_customer.find(
              ({ table }) => table.business_id === business?.id && !table.table_closure_id,
            );

            const table_number = table_open ? table_open.table.number : undefined;

            return {
              ...customer,
              command_open: !!customer.command.filter(
                findCommand => findCommand.business_id === business?.id && !findCommand.command_closure_id,
              ).length,
              table_number,
            };
          }),
        });
      } catch {
        addToast({
          type: 'error',
          message: 'Opss... Encontramos um erro',
          description: 'Ocorreu um erro ao busca por cliente',
        });
      } finally {
        setLoadingSearch(false);
      }
    },
    [addToast, business],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search?.trim()) handleSearchCustomers(search.trim());
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [search, handleSearchCustomers]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (responseModal?.action === 'close_search') {
      setSearch('');
      setSearchCustomers({} as SearchCostumer);
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
            {!!searchCustomers?.customersInBusiness?.length && (
              <>
                <h1>Clientes em {business?.name}</h1>
                <BoxSearch customer={searchCustomers.customersInBusiness} handleCommandOrTable={handleCommandOrTable} />
                {(searchCustomers?.customersOtherBusiness?.length || searchCustomers?.users?.length) && <Separator />}
              </>
            )}

            {!!searchCustomers?.customersOtherBusiness?.length && (
              <>
                <h1>Clientes em outros negócios</h1>
                <BoxSearch customer={searchCustomers.customersOtherBusiness} whichCustumer="otherBusiness" />
                {searchCustomers?.users?.length && <Separator />}
              </>
            )}

            {!!searchCustomers?.users?.length && (
              <>
                <h1>Usuários do goBar encontrados</h1>
                <BoxSearch customer={searchCustomers.users} whichCustumer="user" />
              </>
            )}
          </ContentSearch>
        )}

        <LinkCustom to="/business/register-customer">Cadastrar novo Cliente</LinkCustom>

        {!loadingSearch && !search && (
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
