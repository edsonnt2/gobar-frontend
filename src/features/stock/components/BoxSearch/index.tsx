import { noAvatar } from '@/assets';

import { CustomerBusiness } from '@/services';

import { Container, RowSearch, ImgSearch, InfoSearch, LinkH2, ButtonOptions, ButtonSearch, LinkSearch } from './styles';

interface HandleCommandOrTable {
  customer: Partial<CustomerBusiness>;
  command_or_table: 'command' | 'table';
}

interface BoxSearchProps {
  customer: Partial<CustomerBusiness>[];
  whichCustumer?: 'inBussiness' | 'otherBusiness' | 'user';
  handleCommandOrTable?(data: HandleCommandOrTable): void;
}

const BoxSearch: React.FC<BoxSearchProps> = ({ customer, handleCommandOrTable, whichCustumer = 'inBussiness' }) => {
  return (
    <Container>
      {customer.map(getCustomer => (
        <RowSearch key={getCustomer.id}>
          <ImgSearch>
            <img src={getCustomer.avatar_url || noAvatar} alt={getCustomer.name} />
          </ImgSearch>

          {whichCustumer === 'inBussiness' && handleCommandOrTable ? (
            <InfoSearch>
              <LinkH2 to={`/business/customer/${getCustomer.id}`}>{getCustomer.name}</LinkH2>
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
                  {getCustomer.command_open ? 'Fechar Comanda' : 'Abrir Comanda'}
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
                  {getCustomer.table_number ? `Mesa ${getCustomer.table_number}` : 'Adicionar em Mesa'}
                </ButtonSearch>
                <ButtonSearch type="button">Abrir Conta</ButtonSearch>
              </ButtonOptions>
            </InfoSearch>
          ) : (
            <LinkSearch to={whichCustumer === 'user' ? '/business' : `/business/register-customer/${getCustomer.id}`}>
              <ImgSearch>
                <img src={getCustomer.avatar_url || noAvatar} alt={getCustomer.name} />
              </ImgSearch>

              <InfoSearch>
                <h2>{getCustomer.name}</h2>
                <span>Vincular usuário com (business?.name arrumar isso)</span>
              </InfoSearch>
            </LinkSearch>
          )}
        </RowSearch>
      ))}
    </Container>
  );
};

export default BoxSearch;
