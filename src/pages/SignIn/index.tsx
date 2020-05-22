import React from 'react';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';

import { Link } from 'react-router-dom';
import {
  Container,
  Content,
  AsideLogin,
  ContentDescription,
  Footer,
} from './styles';
import imgLogo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

const singIn: React.FC = () => (
  <Container>
    <Content>
      <AsideLogin>
        <img src={imgLogo} alt="GoBar" />

        <h1>Faça seu Login</h1>
        <Input icon={FiUser} placeholder="Celular ou E-mail" />
        <Input icon={FiLock} placeholder="Senha" type="password" />
        <Button type="submit">ENTRAR</Button>

        <a href="teste">Esqueci minha senha</a>

        <Link to="signup">
          <FiLogIn size={22} />
          Crie sua conta
        </Link>
      </AsideLogin>

      <ContentDescription>
        <nav>
          <ul>
            <li>
              <a href="teste">Como funciona</a>
            </li>
            <li>
              <a href="teste">Planos</a>
            </li>
            <li>
              <a href="teste">Contato</a>
            </li>
          </ul>
        </nav>

        <h1>Conectando os Melhores Clientes com os Melhores Ambientes.</h1>

        <h2>Para Você Cliente</h2>
        <p>Encontrar seu ambiente preferido perto de você</p>
        <p>Faça seu pedido pelo nosso app para nem chamar o garçon</p>
        <p>Tenha controle de tudo que você pede e gasta</p>

        <h2>Para Você Comerciante</h2>
        <p>Gerenciamento completo do seu négicio</p>
        <p>Localização do seu négicio no mapa do app</p>
        <p>Receber pedidos de clientes para agilizar o atendimento</p>
      </ContentDescription>
    </Content>
    <Footer>goBar © 2020 - Todos os direitos reservados</Footer>
  </Container>
);

export default singIn;
