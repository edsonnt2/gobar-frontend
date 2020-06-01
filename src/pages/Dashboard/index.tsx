import React from 'react';
import { FiSearch, FiCrosshair } from 'react-icons/fi';

import imgLocation from '../../assets/img-location.svg';

import Header from '../../components/Header';

import {
  Container,
  Content,
  InputLocation,
  ButtonLocation,
  RegisterBusiness,
  Footer,
} from './styles';

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Header />

      <Content>
        <img src={imgLocation} alt="Location" />

        <h1>Onde você deseja encontrar os melhores ambientes?</h1>

        <InputLocation>
          <FiSearch size={20} />
          <input
            name="search_location"
            placeholder="Buscar por endereço e número"
          />
        </InputLocation>

        <ButtonLocation type="button">
          <FiCrosshair size={20} />
          Usar minha localização
        </ButtonLocation>

        <RegisterBusiness to="register-business">
          Quero usar o goBar em meu negócio
        </RegisterBusiness>
      </Content>
      <Footer>
        <div>goBar © 2020 - Todos os direitos reservados</div>
      </Footer>
    </Container>
  );
};

export default Dashboard;
