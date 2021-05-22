import { useCallback, useRef, useState, useEffect } from 'react';
import { FiXCircle, FiSearch } from 'react-icons/fi';
import { GiTable } from 'react-icons/gi';

import { TableService } from '@/services';
import { InputSearch } from '@/components';
import { PlaceTable, useAuth, useModal, useToast } from '@/hooks';

import { Container, CloseTable, BoxTable, ContainerTables } from './styles';

interface Props {
  style: React.CSSProperties;
  place: PlaceTable;
}

interface ListTableProps {
  isEmpty: boolean;
  number: number;
}

const ListTables: React.FC<Props> = ({ style, place }) => {
  const { business } = useAuth();
  const { addToast } = useToast();
  const { removeModal } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const [LoadingSearch, setLoadingSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [listTable, setListTable] = useState<ListTableProps[]>([]);
  const [allTables, setAllTables] = useState<ListTableProps[]>([]);

  const loadTables = useCallback(async () => {
    if (!business?.table) return;

    setLoadingSearch(true);

    try {
      const response = await TableService.fecthTables();
      const getTables = Array.from(
        {
          length: business.table,
        },
        (_, index): ListTableProps => ({
          number: index + 1,
          isEmpty: !response.some(({ number }) => +number === index + 1),
        }),
      );

      const tables = place === 'launch' ? getTables : getTables.filter(({ isEmpty }) => !isEmpty);

      setListTable(tables);
      setAllTables(tables);
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Opss.. Encontramos um erro',
        description: 'Ocorreu um erro ao tentar listar as comandas abertas, por favor, tente novamente !',
      });
    } finally {
      setLoadingSearch(false);
    }
  }, [addToast, business, place]);

  const handleSearch = useCallback(
    (findTable: string) => {
      if (!findTable?.trim()) {
        setSearch('');
        setListTable(allTables);
      }

      setSearch(findTable.trim());
      setListTable(allTables.filter(({ number }) => number.toString().includes(findTable.trim())));
    },
    [allTables],
  );

  const handleClick = useCallback(
    (number: number) => {
      removeModal(number);
    },
    [removeModal],
  );

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Container style={style}>
      <h1>Selecionar {place === 'launch' ? 'ou abrir nova mesa' : 'mesa para fechar'}</h1>

      <CloseTable type="button" onClick={() => removeModal()}>
        <FiXCircle size={28} />
      </CloseTable>

      <InputSearch
        icon={FiSearch}
        inputRef={inputRef}
        valueSearch={search}
        handleSearch={handleSearch}
        placeholder="Busque pelo número da mesa"
      />

      {LoadingSearch ? (
        'loading...'
      ) : (
        <ContainerTables>
          {listTable.map(list => (
            <BoxTable
              key={list.number.toString()}
              isEmpty={Number(list.isEmpty)}
              onClick={() => handleClick(list.number)}
            >
              <h2>
                <GiTable size={40} />
                {list.number}
              </h2>
              <span>{list.isEmpty ? 'MESA LIVRE' : 'MESA EM USO'}</span>
            </BoxTable>
          ))}
        </ContainerTables>
      )}
    </Container>
  );
};

export default ListTables;
