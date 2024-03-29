import { useRef, useCallback } from 'react';
import { FiUser, FiSmartphone, FiMail, FiCalendar, FiLock, FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { AuthService, SignInDTO } from '@/services';
import { Input, Button } from '@/components';
import { useToast, useAuth, useLoading } from '@/hooks';
import { DateUtils, FormattedUtils, getValidationErrors } from '@/utils';
import { logo } from '@/assets';

import { Container, Content, AsideRegister, ContentDescription, Footer } from './styles';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { setLoading } = useLoading();
  const { addToast } = useToast();
  const { saveAuth } = useAuth();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInDTO) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
          cell_phone: Yup.string().required('Celular é obrigatório'),
          password: Yup.string().min(6, 'Senha precisa ter no mínimo 6 caracteres').required('Senha é obrigatório'),
          birthDate: Yup.string().required('Data de nascimento é obrigatório'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        const { birthDate, cell_phone, ...other } = data;

        const response = await AuthService.registerUser({
          ...other,
          cell_phone: FormattedUtils.onlyNumber(cell_phone),
          birthDate: DateUtils.formattedBirth(birthDate),
        });

        if (!response) throw new Error();

        saveAuth(response);

        addToast({
          type: 'success',
          message: 'Cadastro feito com sucesso',
          description: `Ola ${response.user.name}, seja bem vindo ao goBar ;)`,
        });

        history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }

        const whichError = error?.response?.data?.message || undefined;

        const typeErrors: { [key: string]: any } = {
          'Email already registered in another account': { email: 'E-mail já está cadastrado' },
          'Phone already registered in another account': { cell_phone: 'Celular já está cadastrado' },
          'Format Date invalid': { birthDate: 'Data informada é inválida' },
          'Age minimum for register is 16 Years': { birthDate: 'Idade mínima é de 16 anos' },
        };

        if (typeErrors[whichError]) {
          formRef.current?.setErrors(typeErrors[whichError]);
          return;
        }
        addToast({
          type: 'error',
          message: 'Erro no cadastro',
          description: whichError || 'Ocorreu um erro ao fazer o cadastro, por favor, tente novamente !',
        });
      } finally {
        setLoading(false);
      }
    },
    [history, addToast, saveAuth, setLoading],
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
          <img src={logo} alt="GoBar" />

          <h1>Faça seu Cadastro</h1>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input name="name" icon={FiUser} placeholder="Nome Completo" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input mask="(99) 99999-9999" name="cell_phone" icon={FiSmartphone} placeholder="Celular" />
            <Input name="password" icon={FiLock} placeholder="Senha" type="password" />
            <Input mask="99/99/9999" name="birthDate" icon={FiCalendar} placeholder="Data de Nascimento" />
            <Button type="submit">CADASTRAR</Button>
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
