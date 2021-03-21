import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';

import { Customer as CustomerDTO } from '@/services';
import { LayoutBusiness } from '@/components';
import { useToast, useModal } from '@/hooks';
import { noAvatar } from '@/assets';

import api from '@/services/api';

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

const Customer: React.FC = () => {
  const { addToast } = useToast();
  const { addModal, responseModal, resetResponseModal } = useModal();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDTO>({} as CustomerDTO);

  useEffect(() => {
    async function loadCustomer(): Promise<void> {
      try {
        const response = await api.get<CustomerDTO>(`customers/${id}`);
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
                <span>{customer.taxId}</span>
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
