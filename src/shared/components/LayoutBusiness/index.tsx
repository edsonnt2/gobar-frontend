import React from 'react';

import {
  Container,
  NavBusiness,
  MenuMain,
  LinkMenu,
  Content,
  Footer,
} from './styles';
import Header from '../Header';

import findCustomer from '../../assets/findcustomer.svg';
import closeCommand from '../../assets/closecommand.svg';
import commandBar from '../../assets/commandbar.svg';
import customerAccount from '../../assets/customeraccount.svg';
import boxFront from '../../assets/boxfront.svg';

interface Props {
  pgActive?:
    | 'find-customer'
    | 'close-command-table'
    | 'register-command-table'
    | 'customer-account'
    | 'boxfront';
}

const LayoutBusiness: React.FC<Props> = ({ children, pgActive }) => {
  return (
    <Container>
      <Header isBusiness />

      <NavBusiness>
        <MenuMain>
          <LinkMenu
            to="/business"
            isshow={Number(pgActive === 'find-customer')}
          >
            <img src={findCustomer} alt="Encontrar Cliente" />
            Encontrar Cliente
          </LinkMenu>
          <LinkMenu
            to="/business/close-command-or-table"
            isshow={Number(pgActive === 'close-command-table')}
          >
            <img src={closeCommand} alt="Fechar Comanda ou Mesa" />
            Fechar Comanda/Mesa
          </LinkMenu>
          <LinkMenu
            to="/business/register-command-or-table"
            isshow={Number(pgActive === 'register-command-table')}
          >
            <img src={commandBar} alt="Lançar Comanda ou Mesa" />
            Lançar Comanda/Mesa
          </LinkMenu>
          <LinkMenu
            to="/business"
            isshow={Number(pgActive === 'customer-account')}
          >
            <img src={customerAccount} alt="Contas de Clientes" />
            Contas de Clientes
          </LinkMenu>
          <LinkMenu to="/business" isshow={Number(pgActive === 'boxfront')}>
            <img src={boxFront} alt="Frente de Caixa" />
            Frente de Caixa
          </LinkMenu>
        </MenuMain>
      </NavBusiness>

      <Content>{children}</Content>
      <Footer>goBar © 2020 - Todos os direitos reservados</Footer>
    </Container>
  );
};

export default LayoutBusiness;
