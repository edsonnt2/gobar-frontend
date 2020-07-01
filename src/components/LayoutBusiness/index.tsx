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
    | 'close-command'
    | 'command-bar'
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
            <img src={findCustomer} alt="Find Customer" />
            Encontrar Cliente
          </LinkMenu>
          <LinkMenu
            to="/business"
            isshow={Number(pgActive === 'close-command')}
          >
            <img src={closeCommand} alt="Close Command" />
            Fechar Comanda/Mesa
          </LinkMenu>
          <LinkMenu to="/business" isshow={Number(pgActive === 'command-bar')}>
            <img src={commandBar} alt="Command Bar" />
            Comanda Bar
          </LinkMenu>
          <LinkMenu
            to="/business"
            isshow={Number(pgActive === 'customer-account')}
          >
            <img src={customerAccount} alt="Customer Accounts" />
            Contas de Clientes
          </LinkMenu>
          <LinkMenu to="/business" isshow={Number(pgActive === 'boxfront')}>
            <img src={boxFront} alt="Boxfront" />
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
