import React from 'react';
import {
  FiUser,
  FiSmartphone,
  FiMail,
  FiCalendar,
  FiLock,
  FiArrowLeft,
} from 'react-icons/fi';

import { Link } from 'react-router-dom';
import {
  Container,
  Content,
  AsideRegister,
  ContentDescription,
  Footer,
} from './styles';
import imgLogo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

const singIn: React.FC = () => (
  <Container>
    <Content>
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
      <AsideRegister>
        <img src={imgLogo} alt="GoBar" />

        <h1>Faça seu Cadastro</h1>
        <Input icon={FiUser} placeholder="Nome Completo" />
        <Input icon={FiSmartphone} placeholder="Celular" />
        <Input icon={FiMail} placeholder="E-mail" />
        <Input icon={FiLock} placeholder="Senha" type="password" />
        <Input icon={FiCalendar} placeholder="Data de Nascimento" />
        <Button type="submit">CADASTRAR</Button>

        <Link to="/">
          <FiArrowLeft size={22} />
          Voltar para login
        </Link>
      </AsideRegister>
    </Content>
    <Footer>goBar © 2020 - Todos os direitos reservados</Footer>
  </Container>
);

export default singIn;