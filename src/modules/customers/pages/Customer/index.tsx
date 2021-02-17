import { useEffect, useState } from 'react';

import { FiArrowLeft } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';
import LayoutBusiness from '@/shared/components/LayoutBusiness';
import api from '@/shared/services/api';
import { useToast } from '@/shared/hooks/Toast';
import { useModal } from '@/shared/hooks/Modal';

import noAvatar from '@/shared/assets/no-avatar.png';

import {
  Container,
  Content,
  BoxCustomer,
  RowCustomer,
  ImgCustomer,
  InfoCustomer,
  OptionsCustomer,
  OptionCustomer,
  BackPage,
} from './styles';

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

const Customer: React.FC = () => {
  const { addToast } = useToast();
  const { addModal, responseModal, resetResponseModal } = useModal();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer>({} as Customer);

  useEffect(() => {
    async function loadCustomer(): Promise<void> {
      try {
        const response = await api.get<Customer>(`customers/${id}`);
        setCustomer(response.data);
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Opss... Encontramos um erro',
          description: 'Ocorreu um erro ao carregar dados do cliente, tente novamente',
        });
      }
    }
    loadCustomer();
  }, [id, addToast]);

  useEffect(() => {
    if (responseModal.action && responseModal.action === 'return_find_customer') {
      resetResponseModal();
      history.push('/business');
    }
  }, [responseModal, resetResponseModal, history]);

  return (
    <LayoutBusiness pgActive="find-customer">
      <Container>
        <BackPage onClick={() => history.goBack()}>
          <FiArrowLeft size={20} />
          Voltar
        </BackPage>
        <Content>
          <h1>Cliente Encontrado</h1>

          <BoxCustomer>
            <RowCustomer>
              <ImgCustomer>
                <img src={customer.avatar_url || noAvatar} alt={customer.name} />
              </ImgCustomer>

              <InfoCustomer>
                <h2>{customer.name}</h2>
                <span>{customer.cell_phone}</span>
                <span>{customer.email}</span>
              </InfoCustomer>
            </RowCustomer>

            <RowCustomer>
              <InfoCustomer>
                <h3>Data de Nascimento</h3>
                <span>{customer.birthDate}</span>
              </InfoCustomer>

              <InfoCustomer>
                <h3>CPF/CNPJ</h3>
                <span>{customer.cpf_or_cnpj}</span>
              </InfoCustomer>
            </RowCustomer>

            <OptionsCustomer>
              <OptionCustomer
                onClick={() => {
                  addModal({
                    customer: {
                      where: 'customer',
                      id: customer.id,
                      name: customer.name,
                      avatar_url: customer.avatar_url || noAvatar,
                      command_or_table: 'command',
                    },
                  });
                }}
              >
                Abrir Comanda
              </OptionCustomer>
              <OptionCustomer>Cliente em Mesa</OptionCustomer>
              <OptionCustomer isOpen>Ver Conta</OptionCustomer>
            </OptionsCustomer>
          </BoxCustomer>
        </Content>
      </Container>
    </LayoutBusiness>
  );
};

export default Customer;
