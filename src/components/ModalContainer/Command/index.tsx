import React, { useCallback, useRef, useState, useEffect } from 'react';

import { TiTicket } from 'react-icons/ti';
import { FiTag, FiXCircle } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import {
  Container,
  CloseCommand,
  BoxInfoCustomer,
  ImgCustomer,
  InfoCustomer,
} from './styles';

import Input from '../../Input';
import Select from '../../Select';
import Button from '../../Button';
import { CustomerData, useModal } from '../../../hooks/Modal';
import api from '../../../services/api';
import { useToast } from '../../../hooks/Toast';
import getValidationErrors from '../../../utils/getValidationErrors';
import formattedValue from '../../../utils/formattedValue';

interface Props {
  style: object;
  data?: CustomerData;
}

interface DataForm {
  number: string;
  ingress_id?: string;
  prepaid_ingress?: string;
  value_consume?: string;
}

type IngressData = {
  id: string;
  description: string;
  value: number;
  consume: boolean;
  value_formatted: string;
  consume_formatted?: string;
}[];

const Command: React.FC<Props> = ({ style, data }) => {
  const { addToast } = useToast();
  const { removeModal } = useModal();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<CustomerData>({} as CustomerData);
  const [ingress, setIngress] = useState<IngressData>([]);

  useEffect(() => {
    formRef.current?.getFieldRef('number').focus();

    api.get<IngressData>('ingress').then(response => {
      setIngress(
        response.data.map(getIngress => ({
          ...getIngress,
          value_formatted: formattedValue(getIngress.value),
          consume_formatted: getIngress.consume ? '- Consuma' : '',
        })),
      );
    });
  }, []);

  useEffect(() => {
    if (data) setCustomer(data);
  }, [data]);

  const handleSubmit = useCallback(
    async (dataForm: DataForm) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape<DataForm>({
          number: Yup.string().required('Número da comanda é obrigatório'),
          ...(ingress.length > 0 && {
            ingress_id: Yup.string().required('Opção de Entrada é obrigatório'),
            prepaid_ingress: Yup.string().required('Entrada é pré-paga?'),
          }),
        });

        await schema.validate(dataForm, {
          abortEarly: false,
        });

        const { number, value_consume, prepaid_ingress, ingress_id } = dataForm;

        await api.post('commands', {
          customer_id: data ? data.id : undefined,
          number,
          ...(ingress_id && { ingress_id }),
          ...(prepaid_ingress && {
            prepaid_ingress: !!Number(prepaid_ingress),
          }),
          ...(value_consume && { value_consume }),
        });

        addToast({
          type: 'success',
          message: 'Comanda Cadastra',
          description: 'Nova comanda foi cadastrada com sucesso',
        });
        const where = data ? data.where : undefined;
        removeModal(where);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        } else {
          const whichError =
            error.response && error.response.data
              ? error.response.data.message
              : 'error';

          if (whichError === 'Command number already registered') {
            formRef.current?.setErrors({
              number: 'Número de comanda já Cadastrado',
            });
          } else {
            addToast({
              type: 'error',
              message: 'Erro no Cadastro',
              description:
                'Ocorreu um erro ao tentar cadastrar comanda, por favor, tente novamente !',
            });
          }
        }
        setLoading(false);
      }
    },
    [addToast, data, ingress.length, removeModal],
  );

  return (
    <Container style={style}>
      <CloseCommand type="button" onClick={() => removeModal()}>
        <FiXCircle size={28} />
      </CloseCommand>
      <BoxInfoCustomer>
        <ImgCustomer>
          <img src={customer.avatar_url} alt={customer.name} />
        </ImgCustomer>
        <InfoCustomer>
          <span>Abrir comanda para</span>
          <h1>{customer.name}</h1>
        </InfoCustomer>
      </BoxInfoCustomer>

      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input
          mask=""
          name="number"
          formatField="number"
          icon={TiTicket}
          hasTitle="Comanda"
          placeholder="Número da Comanda"
        />

        {ingress.length > 0 && (
          <>
            <Select name="ingress_id" hasTitle="Opções de Entrada">
              <option value="">Selecione</option>
              {ingress.map(
                ({ id, description, consume_formatted, value_formatted }) => (
                  <option key={id} value={id}>
                    {`${description} ${consume_formatted} - ${value_formatted}`}
                  </option>
                ),
              )}
            </Select>

            <Select name="prepaid_ingress" hasTitle="Entrada paga na entrada?">
              <option value="">Selecione</option>
              <option value="1">Sim</option>
              <option value="0">Não</option>
            </Select>
          </>
        )}

        <Input
          mask=""
          name="value_consume"
          isCurrency
          icon={FiTag}
          hasTitle="Vale Consumo"
          placeholder="(Opcional)"
        />

        <Button type="submit">
          {loading ? 'Carregando...' : 'Criar Comanda'}
        </Button>
      </Form>
    </Container>
  );
};

export default Command;
