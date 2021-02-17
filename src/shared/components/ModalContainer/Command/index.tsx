import { useCallback, useRef, useState, useEffect } from 'react';
import { FiTag, FiXCircle } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { TiTicket } from 'react-icons/ti';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import api from '@/shared/services/api';

import { CustomerData, useModal } from '@/shared/hooks/Modal';
import { useToast } from '@/shared/hooks/Toast';

import getValidationErrors from '@/shared/utils/getValidationErrors';
import FormattedUtils from '@/shared/utils/formattedUtils';

import Button from '../../Button';
import Select from '../../Select';
import Input from '../../Input';

import { Container, CloseCommand, BoxInfoCustomer, ImgCustomer, InfoCustomer } from './styles';

interface Props {
  style: React.CSSProperties;
  data: CustomerData;
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

const Command: React.FC<Props> = ({ style, data: customer }) => {
  const { addToast } = useToast();
  const { removeModal } = useModal();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [ingress, setIngress] = useState<IngressData>([]);

  const handleSubmit = useCallback(
    async (dataForm: DataForm) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
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

        const formattedValueConsume = value_consume
          ? value_consume
              .split('')
              .filter(char => Number(char) || char === '0' || char === ',')
              .join('')
              .replace(',', '.')
          : undefined;

        await api.post('commands', {
          customer_id: customer.id,
          number,
          ...(ingress_id && { ingress_id }),
          ...(prepaid_ingress && {
            prepaid_ingress: !!Number(prepaid_ingress),
          }),
          ...(formattedValueConsume && {
            value_consume: formattedValueConsume,
          }),
        });

        addToast({
          type: 'success',
          message: 'Comanda Cadastra',
          description: 'Nova comanda foi cadastrada com sucesso',
        });
        removeModal(customer.where);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        } else {
          const whichError = error.response && error.response.data ? error.response.data.message : 'error';

          if (whichError === 'Command number already registered') {
            formRef.current?.setErrors({
              number: 'Número de comanda já Cadastrado',
            });
          } else {
            addToast({
              type: 'error',
              message: 'Erro no Cadastro',
              description: 'Ocorreu um erro ao tentar cadastrar comanda, por favor, tente novamente !',
            });
          }
        }
        setLoading(false);
      }
    },
    [addToast, customer, ingress.length, removeModal],
  );

  useEffect(() => {
    formRef.current?.getFieldRef('number').focus();

    api.get<IngressData>('ingress').then(response => {
      setIngress(
        response.data.map(getIngress => ({
          ...getIngress,
          value_formatted: FormattedUtils.formattedValue(getIngress.value),
          consume_formatted: getIngress.consume ? '- Consuma' : '',
        })),
      );
    });
  }, []);

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
              {ingress.map(({ id, description, consume_formatted, value_formatted }) => (
                <option key={id} value={id}>
                  {`${description} ${consume_formatted} - ${value_formatted}`}
                </option>
              ))}
            </Select>

            <Select name="prepaid_ingress" hasTitle="Entrada paga na entrada?">
              <option value="">Selecione</option>
              <option value="1">Sim</option>
              <option value="0">Não</option>
            </Select>
          </>
        )}

        <Input mask="" name="value_consume" isCurrency icon={FiTag} hasTitle="Vale Consumo" placeholder="(Opcional)" />

        <Button type="submit" loading={loading}>
          Criar Comanda
        </Button>
      </Form>
    </Container>
  );
};

export default Command;
