import { GiBookmarklet, GiTicket, GiRoundTable } from 'react-icons/gi';

import { Container, Menu, LinkMenu } from './styles';

export interface Props {
  whoSelected?: 'product' | 'table' | 'ingress';
}

const MenuRegisterPTT: React.FC<Props> = ({ whoSelected }) => {
  return (
    <Container>
      <Menu>
        <li>
          <LinkMenu to="/business/register-product" selected={whoSelected === 'product' ? 1 : 0}>
            <GiBookmarklet size={20} />
            Cadastrar Produto
          </LinkMenu>
        </li>
        <li>
          <LinkMenu to="/business/register-table" selected={whoSelected === 'table' ? 1 : 0}>
            <GiRoundTable size={20} />
            Cadastrar Mesa
          </LinkMenu>
        </li>
        <li>
          <LinkMenu to="/business/register-ingress" selected={whoSelected === 'ingress' ? 1 : 0}>
            <GiTicket size={20} />
            Cadastrar Entrada
          </LinkMenu>
        </li>
      </Menu>
    </Container>
  );
};

export default MenuRegisterPTT;
