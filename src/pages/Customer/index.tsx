import React, { useEffect, useState } from 'react';

import { FiArrowLeft } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';
import LayoutBusiness from '../../components/LayoutBusiness';

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

import noAvatar from '../../assets/no-avatar.png';
import api from '../../services/api';
import { useToast } from '../../hooks/Toast';
import { useModal } from '../../hooks/Modal';

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
  const { id } = useParams();
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
          description:
            'Ocorreu um erro ao carregar dados do cliente, tente novamente',
        });
      }
    }
    loadCustomer();
  }, [id, addToast]);

  useEffect(() => {
    if (
      responseModal.action &&
      responseModal.action === 'return_find_customer'
    ) {
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
                <img
                  src={customer.avatar_url || noAvatar}
                  alt={customer.name}
                />
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
