import { useCallback, useRef, useState, useEffect, KeyboardEvent } from 'react';
import { FiXCircle, FiSearch } from 'react-icons/fi';

import { Command, CommandService } from '@/services';
import { InputSearch } from '@/components';
import { useModal, useToast } from '@/hooks';
import { noAvatar } from '@/assets';

import { Container, CloseCommand, ImgCustomer, InfoCustomer, ContainerCommands, RowCommand } from './styles';

const ListCommands: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  const { addToast } = useToast();
  const { removeModal } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const [LoadingSearch, setLoadingSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [commands, setCommands] = useState<Command[]>([]);
  const [cursor, setCursor] = useState(-1);

  const loadCommands = useCallback(async () => {
    try {
      const response = await CommandService.fetchCommands();
      setCommands(
        response.map(command => ({
          ...command,
          command: {
            ...command.customer,
            ...(command?.customer?.user?.avatar_url && {
              avatar_url: command.customer.user.avatar_url,
            }),
          },
        })),
      );
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Opss.. Encontramos um erro',
        description: 'Ocorreu um erro ao tentar listar as comandas abertas, por favor, tente novamente !',
      });
    } finally {
      setLoadingSearch(false);
    }
  }, [addToast]);

  const handleSearch = useCallback((valueSearch: string) => {
    setLoadingSearch(true);
    if (valueSearch?.trim()) {
      setSearch(valueSearch);
    } else {
      setSearch('');
      setCommands([]);
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
      if (e.key === 'Enter' && commands.length > 0 && cursor > -1) {
        handleClick(commands[cursor].number);
      } else if (e.key === 'ArrowUp' && cursor >= 0) {
        setCursor(cursor - 1);
      } else if (e.key === 'ArrowDown' && cursor < commands.length - 1) {
        setCursor(cursor + 1);
      }
    },
    [cursor, commands, handleClick],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    loadCommands();
  }, [loadCommands]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search?.trim()) {
        loadCommands();
        return;
      }

      try {
        const response = await CommandService.searchCommands(search);

        setCommands(
          response.map(command => ({
            ...command,
            command: {
              ...command.customer,
              ...(command?.customer?.user?.avatar_url && {
                avatar_url: command.customer.user.avatar_url,
              }),
            },
          })),
        );
      } catch {
        addToast({
          type: 'error',
          message: 'Opss... Encontramos um erro',
          description: 'Ocorreu um erro ao busca por comandas cadastradas, por favor, tente novamente !',
        });
      } finally {
        setLoadingSearch(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [search, addToast, loadCommands]);

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
        <ContainerCommands>
          {commands.map(({ id, number, customer }, index) => (
            <RowCommand key={id} onClick={() => handleClick(number)} hasSelected={cursor === index}>
              <ImgCustomer>
                <img src={customer?.avatar_url || noAvatar} alt={customer?.name || 'Usuário sem foto'} />
              </ImgCustomer>
              <InfoCustomer>
                <h2>{customer?.name || 'Usuário sem nome'}</h2>
                <span>
                  Comanda: <strong>{number}</strong>
                </span>
              </InfoCustomer>
            </RowCommand>
          ))}
        </ContainerCommands>
      )}
    </Container>
  );
};

export default ListCommands;
