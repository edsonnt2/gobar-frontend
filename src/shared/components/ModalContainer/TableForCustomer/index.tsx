import React, { useCallback, useRef, useState, useEffect } from 'react';

import { FiXCircle, FiSearch } from 'react-icons/fi';

import { GiTable } from 'react-icons/gi';
import api from '~/shared/services/api';
import { CustomerData, useModal } from '~/shared/hooks/Modal';
import { useToast } from '~/shared/hooks/Toast';
import InputSearch from '~/shared/components/InputSearch';

import {
  Container,
  CloseCommand,
  BoxInfoCustomer,
  ImgCustomer,
  InfoCustomer,
  ListTable,
  BoxTable,
} from './styles';
import { useAuth } from '~/shared/hooks/Auth';

interface Props {
  style: object;
  data: CustomerData;
}

interface ListTableProps {
  isEmpty: boolean;
  number: number;
}

interface RequestTable {
  number: string;
}

const TableForCustomer: React.FC<Props> = ({ style, data }) => {
  const { business } = useAuth();
  const { addToast } = useToast();
  const { removeModal } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [listTable, setListTable] = useState<ListTableProps[]>([]);
  const [allTables, setAllTables] = useState<ListTableProps[]>([]);

  const handleSearch = useCallback(
    (findTable: string) => {
      if (findTable !== '') {
        setSearch(findTable);
        setListTable(
          allTables.filter(({ number }) => String(number).includes(findTable)),
        );
      } else {
        setSearch('');
        setListTable(allTables);
      }
    },
    [allTables],
  );

  const handleOpenTable = useCallback(
    (number: number) => {
      api
        .post('tables', {
          number,
          customer_id: data.id,
        })
        .catch(() => {
          addToast({
            type: 'error',
            message: 'Ops.. Encontramos um erro',
            description:
              'Ocorreu um erro ao tentar abrir a mesa, por favor, tente novamente',
          });
        });

      addToast({
        type: 'success',
        message: `Mesa ${number} aberta com sucesso`,
      });

      removeModal(data.where);
    },
    [addToast, removeModal, data],
  );

  useEffect(() => {
    if (business) {
      setLoading(true);
      api
        .get<RequestTable[]>('tables')
        .then(response => {
          const getTables = Array.from(
            {
              length: business.table,
            },
            (_, index): ListTableProps => ({
              number: index + 1,
              isEmpty: !response.data.some(
                ({ number }) => Number(number) === index + 1,
              ),
            }),
          );

          setListTable(getTables);
          setAllTables(getTables);
        })
        .catch(() => {
          addToast({
            type: 'error',
            message: 'Opss.. Encontramos um erro',
            description:
              'Ocorreu um erro ao carregar as mesas para esse comércio, por favor, tente novamente',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [addToast, business]);

  return (
    <Container style={style}>
      <CloseCommand type="button" onClick={() => removeModal()}>
        <FiXCircle size={28} />
      </CloseCommand>
      <BoxInfoCustomer>
        <ImgCustomer>
          <img src={data.avatar_url} alt={data.name} />
        </ImgCustomer>
        <InfoCustomer>
          <span>Adicionar Cliente em Mesa</span>
          <h1>{data.name}</h1>
        </InfoCustomer>
      </BoxInfoCustomer>

      <InputSearch
        icon={FiSearch}
        inputRef={inputRef}
        valueSearch={search}
        handleSearch={handleSearch}
        isNumber
        style={{ marginLeft: 4 }}
        placeholder="Busque pelo número da Mesa"
      />

      {loading && <span>loading...</span>}

      {listTable.length > 0 && (
        <ListTable>
          {listTable.map(list => (
            <BoxTable
              key={String(list.number)}
              isEmpty={Number(list.isEmpty)}
              onClick={() => handleOpenTable(list.number)}
            >
              <h2>
                <GiTable size={40} />
                {list.number}
              </h2>
              <span>{list.isEmpty ? 'MESA LIVRE' : 'MESA EM USO'}</span>
            </BoxTable>
          ))}
        </ListTable>
      )}
    </Container>
  );
};

export default TableForCustomer;
