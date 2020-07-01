import React, { useRef, useCallback, useState } from 'react';
import {
  FiUser,
  FiSmartphone,
  FiMail,
  FiCalendar,
  FiLock,
  FiArrowLeft,
} from 'react-icons/fi';

import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
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
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/Toast';
import { useAuth } from '../../hooks/Auth';

interface SignInData {
  full_name: string;
  cell_phone: string;
  email: string;
  password: string;
  birthDate: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { saveAuth } = useAuth();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape<SignInData>({
          full_name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .email('E-mail inválido')
            .required('E-mail é obrigatório'),
          cell_phone: Yup.string().required('Celular é obrigatório'),
          password: Yup.string()
            .min(6, 'Senha precisa ter no mínimo 6 caracteres')
            .required('Senha é obrigatório'),
          birthDate: Yup.string().required('Data de nascimento é obrigatório'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        const { birthDate, cell_phone, ...other } = data;

        const formattedCellPhone = cell_phone
          .split('')
          .filter(char => Number(char) || char === '0')
          .join('');

        const splitBirth = birthDate.split('/');

        const formattedBirth = `${splitBirth[2]}-${splitBirth[1]}-${splitBirth[0]}`;

        const {
          data: { user, token },
        } = await api.post('users', {
          birthDate: formattedBirth,
          cell_phone: formattedCellPhone,
          ...other,
        });

        saveAuth({ user, token });

        addToast({
          type: 'success',
          message: 'Cadastro feito com sucesso',
          description: `Ola ${user.full_name}, seja bem vindo ao goBar ;)`,
        });

        history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        } else {
          let errorData;

          const whichError =
            error.response && error.response.data
              ? error.response.data.message
              : 'error';

          switch (whichError) {
            case 'Email already registered in another account':
              errorData = { email: 'E-mail já está cadastrado' };
              break;
            case 'Phone already registered in another account':
              errorData = { cell_phone: 'Celular já está cadastrado' };
              break;
            case 'Format Date invalid':
              errorData = { birthDate: 'Data informada é inválida' };
              break;
            case 'Age minimum for register is 16 Years':
              errorData = { birthDate: 'Idade mínima é de 16 anos' };
              break;
            default:
              errorData = undefined;
              break;
          }

          if (errorData) {
            formRef.current?.setErrors(errorData);
          } else {
            addToast({
              type: 'error',
              message: 'Erro no cadastro',
              description:
                'Ocorreu um erro ao fazer o cadastro, por favor, tente novamente !',
            });
          }
        }
        setLoading(false);
      }
    },
    [history, addToast, saveAuth],
  );

  return (
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
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input
              mask=""
              name="full_name"
              icon={FiUser}
              placeholder="Nome Completo"
            />
            <Input mask="" name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              mask="(99) 99999-9999"
              name="cell_phone"
              icon={FiSmartphone}
              placeholder="Celular"
            />
            <Input
              mask=""
              name="password"
              icon={FiLock}
              placeholder="Senha"
              type="password"
            />
            <Input
              mask="99/99/9999"
              name="birthDate"
              icon={FiCalendar}
              placeholder="Data de Nascimento"
            />
            <Button type="submit">
              {loading ? 'Carregando...' : 'CADASTRAR'}
            </Button>
          </Form>

          <Link to="/">
            <FiArrowLeft size={22} />
            Voltar para login
          </Link>
        </AsideRegister>
      </Content>
      <Footer>goBar © 2020 - Todos os direitos reservados</Footer>
    </Container>
  );
};
export default SignUp;
