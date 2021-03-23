import { useCallback, useRef, useState, useEffect } from 'react';
import { FiTag, FiXCircle } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { TiTicket } from 'react-icons/ti';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { CommandService, EntranceService, Entrance } from '@/services';
import { CustomerData, useModal, useToast } from '@/hooks';
import { Button, Select, Input } from '@/components';
import { getValidationErrors, FormattedUtils } from '@/utils';

import { Container, CloseCommand, BoxInfoCustomer, ImgCustomer, InfoCustomer } from './styles';

interface Props {
  style: React.CSSProperties;
  data: CustomerData;
}

interface DataForm {
  number: string;
  entrance_id?: string;
  prepaid_entrance?: string;
  value_consume?: string;
}

const Command: React.FC<Props> = ({ style, data: customer }) => {
  const { addToast } = useToast();
  const { removeModal } = useModal();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [entrance, setEntrance] = useState<Entrance[]>([]);

  const handleSubmit = useCallback(
    async (dataForm: DataForm) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          number: Yup.string().required('Número da comanda é obrigatório'),
          ...(entrance.length > 0 && {
            entrance_id: Yup.string().required('Opção de Entrada é obrigatório'),
            prepaid_entrance: Yup.string().required('Entrada é pré-paga?'),
          }),
        });

        await schema.validate(dataForm, {
          abortEarly: false,
        });

        const { number, value_consume, prepaid_entrance, entrance_id } = dataForm;

        const formattedValueConsume = value_consume
          ? value_consume
              .split('')
              .filter(char => Number(char) || char === '0' || char === ',')
              .join('')
              .replace(',', '.')
          : undefined;

        await CommandService.registerCommand({
          customer_id: customer.id,
          number,
          ...(entrance_id && { entrance_id }),
          ...(prepaid_entrance && {
            prepaid_entrance: !!Number(prepaid_entrance),
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
          return;
        }

        const whichError = error?.response?.data?.message || undefined;

        const typeErrors: { [key: string]: any } = {
          'Command number already registered': { number: 'Número de comanda já Cadastrado' },
        };

        if (typeErrors[whichError]) {
          formRef.current?.setErrors(typeErrors[whichError]);
          return;
        }

        addToast({
          type: 'error',
          message: 'Erro no Cadastro',
          description: whichError || 'Ocorreu um erro ao tentar cadastrar comanda, por favor, tente novamente !',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, customer, entrance.length, removeModal],
  );

  useEffect(() => {
    formRef.current?.getFieldRef('number').focus();

    EntranceService.fetchEntrance().then(response => {
      setEntrance(
        response.map(getEntrance => ({
          ...getEntrance,
          value_formatted: FormattedUtils.formattedValue(getEntrance.value),
          consume_formatted: getEntrance.consume ? '- Consuma' : '',
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
        <Input name="number" formatField="number" icon={TiTicket} hasTitle="Comanda" placeholder="Número da Comanda" />

        {entrance.length > 0 && (
          <>
            <Select name="entrance_id" hasTitle="Opções de Entrada">
              <option value="">Selecione</option>
              {entrance.map(({ id, description, consume_formatted, value_formatted }) => (
                <option key={id} value={id}>
                  {`${description} ${consume_formatted} - ${value_formatted}`}
                </option>
              ))}
            </Select>

            <Select name="prepaid_entrance" hasTitle="Entrada paga na entrada?">
              <option value="">Selecione</option>
              <option value="1">Sim</option>
              <option value="0">Não</option>
            </Select>
          </>
        )}

        <Input name="value_consume" isCurrency icon={FiTag} hasTitle="Vale Consumo" placeholder="(Opcional)" />

        <Button type="submit" loading={loading}>
          Criar Comanda
        </Button>
      </Form>
    </Container>
  );
};

export default Command;
