import { useCallback, useRef, useState, useEffect, ChangeEvent, Fragment } from 'react';
import { FiXCircle, FiScissors } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Button, Select, Input } from '@/components';
import { MakeyPayData, useLoading, useModal, useToast } from '@/hooks';
import { getValidationErrors, FormattedUtils } from '@/utils';

import { onChangeDiscont, onChangePayment, sendPayment } from './Functions';

import { Container, ClosePay, RowHeaderPay, HeaderLeft, HeaderRight, RowInput, SeparateInput } from './styles';

export interface PayData extends MakeyPayData {
  value_formatted: string;
  value_discont?: number;
}
export interface FnOnChange {
  value: number;
  indexRef: number;
}

type TypeForm = 'money' | 'card' | '';

export interface FormOfPayment {
  type: TypeForm;
  subtotal: {
    value: number;
    value_formatted: string;
  };
  received?: {
    value: number;
    value_formatted: string;
  };
  change_value?: {
    value: number;
    value_formatted: string;
  };
}

const MakePay: React.FC<{ style: React.CSSProperties; data: MakeyPayData }> = ({ style, data }) => {
  const { setLoading } = useLoading();
  const { addToast } = useToast();
  const { removeModal } = useModal();
  const formRef = useRef<FormHandles>(null);
  const [textButton, setTextButton] = useState('Fazer Pagamento');
  const [formOfPayment, setFormOfPayment] = useState<FormOfPayment[]>([
    {
      type: '',
      subtotal: {
        value: data.value_total,
        value_formatted: FormattedUtils.formattedValue(data.value_total),
      },
    },
  ]);

  const [payData, setPayData] = useState<PayData>({
    ...data,
    value_formatted: FormattedUtils.formattedValue(data.value_total),
  });

  const handleSubmit = useCallback(
    async (dataForm: { type_card?: string[] }) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const response = await sendPayment({
          formOfPayment,
          payData,
          dataForm,
        });

        if (!response) throw new Error();

        if (typeof response === 'object') {
          formRef.current?.setErrors(response);
          return;
        }

        removeModal(response);
        addToast({
          type: 'success',
          message:
            response === 'payment'
              ? `${
                  payData.close_id.length
                    ? `${payData.type === 'command' ? 'Comanda' : 'Mesa'} fechada`
                    : `${payData.type === 'command' ? 'Comanda' : 'Mesa'}s fechadas`
                } com sucesso`
              : 'Desconto em comanda feito com sucesso',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }

        const whichError = error?.response?.data?.message || undefined;

        const typeErrors: { [key: string]: string } = {
          'Type money requires value received': 'Forma de pagamento em dinheiro requer valor recebido',
          'One of the command was not found in the business': 'Uma das comandas não foram encontradas no negócio',
          'Type card requires selected of card': 'Forma de pagamento em cartão requer a seleção do tipo de cartão',
        };

        addToast({
          type: 'error',
          message: 'Erro no Pagamento',
          description:
            typeErrors[whichError] || 'Ocorreu um erro ao tentar finalizar o pagamento, por favor, tente novamente !',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, formOfPayment, payData, removeModal, setLoading],
  );

  const handleFormPayment = useCallback(
    (e: ChangeEvent<HTMLSelectElement>, index: number) => {
      const value = e.target.value as TypeForm;
      const indexPay = formOfPayment.findIndex((_, i) => i === index);

      if (indexPay > -1) {
        setFormOfPayment(prevState =>
          prevState.map((prev, i) =>
            i === index
              ? {
                  ...prev,
                  type: value,
                }
              : prev,
          ),
        );
      }
    },
    [formOfPayment],
  );

  const fnOnChangeDiscont = useCallback(
    ({ value }: Omit<FnOnChange, 'indexRef'>) => {
      setPayData(prevPay => ({
        ...prevPay,
        value_discont: value,
      }));

      setFormOfPayment(prevState =>
        onChangeDiscont({
          formOfPayment: prevState,
          payData,
          value,
        }),
      );
    },
    [payData],
  );

  const fnOnChange = useCallback(
    ({ indexRef, value }: FnOnChange) => {
      formRef.current?.setErrors({});

      const valueTotalPay = payData.value_discont ? payData.value_total - payData.value_discont : payData.value_total;

      if (indexRef) {
        const sumSubTotal = formOfPayment.reduce((prevValue, subTotal, index) => {
          if (subTotal?.type) return index === indexRef ? prevValue + value : prevValue + subTotal.subtotal.value;

          return prevValue;
        }, 0);

        if (sumSubTotal > valueTotalPay)
          formRef.current?.setErrors({
            [`subtotal[${indexRef}]`]: 'Valor maior que total',
          });
      }

      setFormOfPayment(
        onChangePayment({
          formOfPayment,
          indexRef,
          value,
          valueTotalPay,
        }),
      );

      if (!indexRef && valueTotalPay < value)
        formRef.current?.setErrors({
          'subtotal[0]': 'Valor maior que total',
        });
    },
    [payData, formOfPayment],
  );

  const fnOnChangeValue = useCallback(({ indexRef, value }: FnOnChange) => {
    setFormOfPayment(prevState =>
      prevState.map((prev, index) => {
        if (index === indexRef) {
          const newChangeValue = value - prev.subtotal.value;
          return {
            ...prev,
            received: {
              value,
              value_formatted: FormattedUtils.formattedValue(value),
            },
            change_value: {
              value: newChangeValue,
              value_formatted: newChangeValue > 0 ? FormattedUtils.formattedValue(newChangeValue) : ' ',
            },
          };
        }
        return prev;
      }),
    );
  }, []);

  useEffect(() => {
    const sumSubTotal = formOfPayment.reduce((prevValue, subTotal) => {
      return subTotal?.type ? prevValue + subTotal.subtotal.value : prevValue;
    }, 0);

    const valueTotalPay = payData.value_discont ? payData.value_total - payData.value_discont : payData.value_total;

    setTextButton(
      sumSubTotal !== 0 && sumSubTotal < valueTotalPay && payData.close_id.length === 1
        ? 'Descontar Pagamento'
        : 'Fazer Pagamento',
    );
  }, [formOfPayment, payData]);

  return (
    <Container style={style}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <ClosePay type="button" onClick={() => removeModal()}>
          <FiXCircle size={28} />
        </ClosePay>

        <RowHeaderPay>
          <HeaderLeft>
            <h2>VALOR TOTAL A SER PAGO:</h2>
            <h1>{payData.value_formatted}</h1>
          </HeaderLeft>

          <HeaderRight>
            <Input
              name="discount"
              isCurrency
              placeholder="Desconto"
              hasOnChange={{
                fnOnChange: fnOnChangeDiscont,
              }}
              icon={FiScissors}
              styleInput={{ width: 124, flex: 'auto' }}
            />
          </HeaderRight>
        </RowHeaderPay>

        {formOfPayment.map((formPay, index) => (
          <Fragment key={index.toString()}>
            <Select
              name={`form_of_payment[${index}]`}
              hasTitle={`${index + 1}º Forma de Pagamento${
                index > 0 && payData.close_id.length === 1 ? ' (Opcional)' : ''
              }`}
              onChange={e => handleFormPayment(e, index)}
            >
              <option value="">Selecione</option>
              <option value="money">Dinheiro</option>
              <option value="card">Cartão</option>
            </Select>

            {formPay?.type && (
              <RowInput>
                <Input
                  name={`subtotal[${index}]`}
                  defaultValue={formPay.subtotal.value_formatted}
                  isCurrency
                  hasTitle="SubTotal"
                  hasOnChange={{
                    indexRef: index,
                    fnOnChange,
                  }}
                  style={{ width: 148, flex: 'inherit' }}
                  styleInput={{ width: '100%', flex: 'auto' }}
                />
                <SeparateInput />
                {formPay.type === 'money' ? (
                  <>
                    <Input
                      name={`received[${index}]`}
                      hasOnChange={{
                        indexRef: index,
                        fnOnChange: fnOnChangeValue,
                      }}
                      defaultValue={formPay.received?.value_formatted}
                      isCurrency
                      hasTitle="Valor Recebido"
                      style={{ width: 148, flex: 'inherit' }}
                      styleInput={{ width: '100%', flex: 'auto' }}
                    />
                    <SeparateInput />
                    <Input
                      name={`change_value[${index}]`}
                      defaultValue={formPay.change_value?.value_formatted}
                      isCurrency
                      hasTitle="Valor de Troco"
                      styleInput={{ width: '100%', flex: 'auto' }}
                      style={{ width: 148, flex: 'inherit' }}
                      disabled
                    />
                  </>
                ) : (
                  <Select name={`type_card[${index}]`} hasTitle="Tipo do Cartão" style={{ flex: 1 }}>
                    <option value="">Selecione</option>
                    <option value="visa-debit">Cartão VISA Débito</option>
                    <option value="visa-credit">Cartão VISA Crédito</option>
                    <option value="master-debit">Cartão MASTERCARD Débito</option>
                    <option value="master-credit">Cartão MASTERCARD Crédito</option>
                    <option value="elo-debit">Cartão ELO Débito</option>
                    <option value="elo-credit">Cartão ELO Crédito</option>
                  </Select>
                )}
              </RowInput>
            )}
          </Fragment>
        ))}

        <Button type="submit">{textButton}</Button>
      </Form>
    </Container>
  );
};

export default MakePay;
