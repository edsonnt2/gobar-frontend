import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import { Container, Content, BackPage, Main, Footer } from './styles';

const RegisterProductBusiness: React.FC = () => {
  const history = useHistory();

  return (
    <Container>
      <Header />

      <Content>
        <BackPage onClick={() => history.goBack()}>
          <FiArrowLeft size={20} />
          Voltar
        </BackPage>
        <Main>Página de Cadastro de Produtos</Main>
      </Content>
      <Footer>
        <div>goBar © 2020 - Todos os direitos reservados</div>
      </Footer>
    </Container>
  );
};

export default RegisterProductBusiness;
