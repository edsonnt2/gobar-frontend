import { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiSmartphone, FiMail, FiCalendar } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { CustomerService, Customer, RegisterCustomer } from '@/services';
import { LayoutBusiness, Button, Input, Select } from '@/components';
import { useToast, useAuth } from '@/hooks';
import { DateUtils, FormattedUtils, getValidationErrors } from '@/utils';

import { Container, Content, BackPage } from './styles';

const FindCustomer: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { business } = useAuth();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dataCustomer, setDataCustomer] = useState<Customer>({} as Customer);

  const loadCustomer = useCallback(async () => {
    if (!id) {
      formRef.current?.getFieldRef('name').focus();
    } else {
      try {
        const response = await CustomerService.fetchCustomer(id);

        if (!response) return;

        setDataCustomer(response);

        formRef.current?.setData({
          name: response.name,
          cell_phone: response.cell_phone,
          email: response.email,
          birthDate: DateUtils.formatDate({ date: response.birthDate, type: 'dd/MM/yyyy' }),
          gender: response.gender,
        });
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Opss... Encontramos um erro',
          description: 'Ocorreu um erro ao carregar os dados do cliente, por favor, tente novamente',
        });
      }
    }
  }, [id, addToast]);

  const handleSubmit = useCallback(
    async (data: RegisterCustomer) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome do Negócio é obrigatório'),
          birthDate: Yup.string().required('Data de nascimento é obrigatório'),
          gender: Yup.string().required('Gênero é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, cell_phone, email, birthDate, gender } = data;

        const response = await CustomerService.registerCustomer({
          customer_id: id,
          name,
          birthDate: DateUtils.formattedBirth(birthDate),
          gender,
          ...(cell_phone && { cell_phone: FormattedUtils.onlyNumber(cell_phone) }),
          ...(email && { email }),
        });

        if (!response) return;

        addToast({
          type: 'success',
          message: 'Cadastro feito com sucesso',
          description: `Novo cliente foi cadastrado no ${business?.name}`,
        });

        history.push(`/business/customer/${response.id}`);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        } else {
          let errorData;

          const whichError = error.response && error.response.data ? error.response.data.message : 'error';

          switch (whichError) {
            case 'Cell phone already registered at another customer':
              errorData = {
                cell_phone: 'Celular já cadastrado por outro cliente',
              };
              break;
            case 'Cell phone already registered at one user':
              errorData = {
                cell_phone: 'Celular já cadastrado por um usuário',
              };
              break;
            case 'E-mail already registered at another customer':
              errorData = { email: 'E-mail já cadastrado por outro cliente' };
              break;
            case 'E-mail already registered at one user':
              errorData = { email: 'E-mail já cadastrado por um usuário' };
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
              description: 'Ocorreu um erro ao fazer o cadastro, por favor, tente novamente !',
            });
          }
        }
        setLoading(false);
      }
    },
    [id, addToast, business, history],
  );

  useEffect(() => {
    loadCustomer();
  }, [id, addToast, loadCustomer]);

  return (
    <LayoutBusiness pgActive="find-customer">
      <Container>
        <BackPage onClick={() => history.goBack()}>
          <FiArrowLeft size={20} />
          Voltar
        </BackPage>
        <Content>
          <h1>Cadastrar novo cliente no Bar da Léo</h1>

          <Form onSubmit={handleSubmit} ref={formRef}>
            <Input mask="" name="name" placeholder="Nome Completo" icon={FiUser} disabled={!!dataCustomer.name} />
            <Input
              mask="(99) 99999-9999"
              name="cell_phone"
              placeholder="Celular (Opcional)"
              icon={FiSmartphone}
              disabled={!!dataCustomer.cell_phone}
            />
            <Input mask="" name="email" placeholder="E-mail (Opcional)" icon={FiMail} disabled={!!dataCustomer.email} />
            <Input
              mask="99/99/9999"
              name="birthDate"
              icon={FiCalendar}
              placeholder="Data de Nascimento"
              disabled={!!dataCustomer.birthDate}
            />
            <Select name="gender" disabled={!!dataCustomer.gender}>
              <option value="">Selecione o Gênero</option>
              <option value="M">Homem</option>
              <option value="W">Mulher</option>
            </Select>

            <Button loading={loading} type="submit">
              CADASTRAR
            </Button>
          </Form>
        </Content>
      </Container>
    </LayoutBusiness>
  );
};

export default FindCustomer;
