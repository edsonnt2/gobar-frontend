import { GiTicket, GiRoundTable } from 'react-icons/gi';

import { Container, Menu, LinkMenu } from './styles';

interface Props {
  whoSelected?: 'table' | 'entrance';
}

const MenuRegisterPTT: React.FC<Props> = ({ whoSelected }) => {
  return (
    <Container>
      <Menu>
        <li>
          <LinkMenu to="/business/register/table" selected={whoSelected === 'table' ? 1 : 0}>
            <GiRoundTable size={20} />
            Cadastrar Mesa
          </LinkMenu>
        </li>
        <li>
          <LinkMenu to="/business/register/entrance" selected={whoSelected === 'entrance' ? 1 : 0}>
            <GiTicket size={20} />
            Cadastrar Entrada
          </LinkMenu>
        </li>
      </Menu>
    </Container>
  );
};

export default MenuRegisterPTT;
