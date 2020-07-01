import React, { useState, useCallback, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import {
  FiArrowLeft,
  FiUser,
  FiSmartphone,
  FiMail,
  FiCalendar,
} from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import LayoutBusiness from '../../components/LayoutBusiness';

import { Container, Content, BackPage } from './styles';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { useToast } from '../../hooks/Toast';
import api from '../../services/api';
import { useAuth } from '../../hooks/Auth';
import getValidationErrors from '../../utils/getValidationErrors';

interface Customer {
  id: string;
  name: string;
  cell_phone: number;
  email: string;
  birthDate: string;
  gender?: 'M' | 'W';
  cpf_or_cnpj?: number;
  avatar_url?: string;
}

interface CustomerData {
  name: string;
  cell_phone?: string;
  email?: string;
  birthDate: string;
  gender: string;
}

const FindCustomer: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { business } = useAuth();
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dataCustomer, setDataCustomer] = useState<Customer>({} as Customer);

  useEffect(() => {
    async function loadCustomer(): Promise<void> {
      if (!id) {
        formRef.current?.getFieldRef('name').focus();
      } else {
        try {
          const { data } = await api.get<Customer>(`customers/${id}`);
          setDataCustomer(data);

          formRef.current?.setData({
            name: data.name,
            cell_phone: data.cell_phone,
            email: data.email,
            birthDate: format(new Date(data.birthDate), 'dd/MM/yyyy'),
            gender: data.gender,
          });
        } catch (error) {
          addToast({
            type: 'error',
            message: 'Opss... Encontramos um erro',
            description:
              'Ocorreu um erro ao carregar os dados do cliente, por favor, tente novamente',
          });
        }
      }
    }
    loadCustomer();
  }, [id, addToast]);

  const handleSubmit = useCallback(
    async (data: CustomerData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape<CustomerData>({
          name: Yup.string().required('Nome do Negócio é obrigatório'),
          birthDate: Yup.string().required('Data de nascimento é obrigatório'),
          gender: Yup.string().required('Gênero é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, cell_phone, email, birthDate, gender } = data;

        const formattedCellPhone =
          cell_phone &&
          cell_phone
            .split('')
            .filter(char => Number(char) || char === '0')
            .join('');

        await api.post('customers', {
          customer_id: id,
          name,
          birthDate,
          gender,
          ...(cell_phone && { cell_phone: formattedCellPhone }),
          ...(email && { email }),
        });

        addToast({
          type: 'success',
          message: 'Cadastro feito com sucesso',
          description: `Novo cliente foi cadastrado no ${business?.name}`,
        });

        history.push('/business');
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
              description:
                'Ocorreu um erro ao fazer o cadastro, por favor, tente novamente !',
            });
          }
        }
        setLoading(false);
      }
    },
    [id, addToast, business, history],
  );

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
            <Input
              mask=""
              name="name"
              placeholder="Nome Completo"
              icon={FiUser}
              disabled={!!dataCustomer.name}
            />
            <Input
              mask=""
              name="cell_phone"
              placeholder="Celular (Opcional)"
              icon={FiSmartphone}
              disabled={!!dataCustomer.cell_phone}
            />
            <Input
              mask=""
              name="email"
              placeholder="E-mail (Opcional)"
              icon={FiMail}
              disabled={!!dataCustomer.email}
            />
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

            <Button type="submit">
              {loading ? 'Carregando...' : 'CADASTRAR'}
            </Button>
          </Form>
        </Content>
      </Container>
    </LayoutBusiness>
  );
};

export default FindCustomer;
