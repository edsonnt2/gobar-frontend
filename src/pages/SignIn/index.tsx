import React, { useCallback, useRef, useState } from 'react';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { Link, useHistory } from 'react-router-dom';
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
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/Toast';
import { useAuth } from '../../hooks/Auth';

interface SignInData {
  cellPhoneOrEmail: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { signIn } = useAuth();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          cellPhoneOrEmail: Yup.string().required(
            'Coloque seu celular ou e-mail',
          ),
          password: Yup.string().required('Coloque sua senha'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          cellPhoneOrEmail: data.cellPhoneOrEmail,
          password: data.password,
        });

        addToast({
          type: 'success',
          message: 'Login feito com sucesso',
          description: 'Estamos felizes em te ver por aqui :D',
        });

        history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        } else {
          const description =
            error.response &&
            error.response.data &&
            error.response.data.message === 'Credentials is required'
              ? 'Cheque suas credenciais e tente fazer login novamente'
              : 'Ocorreu um erro ao fazer o login, por favor, tente novamente';

          addToast({
            type: 'error',
            message: 'Erro ao fazer login',
            description,
          });
        }
        setLoading(false);
      }
    },
    [addToast, signIn, history],
  );

  return (
    <Container>
      <Content>
        <AsideLogin>
          <img src={imgLogo} alt="GoBar" />

          <h1>Faça seu Login</h1>
          <Form onSubmit={handleSubmit} ref={formRef}>
            <Input
              mask=""
              icon={FiUser}
              name="cellPhoneOrEmail"
              placeholder="Celular ou E-mail"
            />
            <Input
              mask=""
              icon={FiLock}
              name="password"
              placeholder="Senha"
              type="password"
            />
            <Button type="submit">
              {loading ? 'Carregando...' : 'ENTRAR'}
            </Button>
          </Form>
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
};

export default SignIn;
