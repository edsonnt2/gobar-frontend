import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  Fragment,
} from 'react';
import { FiXCircle, FiScissors } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import api from '~/shared/services/api';

import { MakeyPayData, useModal } from '~/shared/hooks/Modal';
import { useToast } from '~/shared/hooks/Toast';

import Button from '../../Button';
import Select from '../../Select';
import Input from '../../Input';

import getValidationErrors from '~/shared/utils/getValidationErrors';
import FormattedUtils from '~/shared/utils/formattedUtils';

import {
  Container,
  ClosePay,
  RowHeaderPay,
  HeaderLeft,
  HeaderRight,
  RowInput,
  SeparateInput,
} from './styles';
import PaymentUtils from './utils/paymentUtils';

export interface PayData extends MakeyPayData {
  value_formatted: string;
  value_descont?: number;
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

const MakePay: React.FC<{ style: React.CSSProperties; data: MakeyPayData }> = ({
  style,
  data,
}) => {
  const { addToast } = useToast();
  const { removeModal } = useModal();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
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

        const response = await PaymentUtils.sendPayment({
          formOfPayment,
          payData,
          dataForm,
        });

        if (response && typeof response === 'object') {
          formRef.current?.setErrors(response);
          return;
        }

        if (response === 'discount') {
          removeModal('discount');
          addToast({
            type: 'success',
            message: 'Desconto em comanda feito com sucesso',
          });
        }

        if (response === 'payment') {
          removeModal('payment');
          addToast({
            type: 'success',
            message: `${
              payData.close_id.length === 1
                ? `${payData.type === 'command' ? 'Comanda' : 'Mesa'} fechada`
                : `${payData.type === 'command' ? 'Comanda' : 'Mesa'}s fechadas`
            } com sucesso`,
          });
        }

        addToast({
          type: 'error',
          message: 'Erro no Cadastro',
          description:
            'Ocorreu um erro ao tentar cadastrar comanda, por favor, tente novamente !',
        });
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
      } finally {
        setLoading(false);
      }
    },
    [addToast, formOfPayment, payData, removeModal],
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

  const fnOnChangeDescont = useCallback(
    ({ value }: Omit<FnOnChange, 'indexRef'>) => {
      setPayData(prevPay => ({
        ...prevPay,
        value_descont: value,
      }));

      setFormOfPayment(prevState => {
        const valueWithDescont = payData.value_total - value;
        if (prevState.length === 1) {
          return [
            {
              ...prevState[0],
              subtotal: {
                value: valueWithDescont,
                value_formatted: FormattedUtils.formattedValue(
                  valueWithDescont,
                ),
              },
              ...(prevState[0].received && {
                change_value: {
                  value: prevState[0].received.value - valueWithDescont,
                  value_formatted:
                    prevState[0].received.value - valueWithDescont > 0
                      ? FormattedUtils.formattedValue(
                          prevState[0].received.value - valueWithDescont,
                        )
                      : ' ',
                },
              }),
            },
          ];
        }

        return [
          prevState[0],
          {
            ...prevState[1],
            subtotal: {
              value: valueWithDescont - prevState[0].subtotal.value,
              value_formatted: FormattedUtils.formattedValue(
                valueWithDescont - prevState[0].subtotal.value,
              ),
            },
            ...(prevState[1].received && {
              change_value: {
                value:
                  prevState[1].received.value -
                  (valueWithDescont - prevState[0].subtotal.value),
                value_formatted:
                  prevState[1].received.value -
                    (valueWithDescont - prevState[0].subtotal.value) >
                  0
                    ? FormattedUtils.formattedValue(
                        prevState[1].received.value -
                          (valueWithDescont - prevState[0].subtotal.value),
                      )
                    : ' ',
              },
            }),
          },
        ];
      });
    },
    [payData],
  );

  const fnOnChange = useCallback(
    ({ indexRef, value }: FnOnChange) => {
      formRef.current?.setErrors({});

      const valueTotalPay = payData.value_descont
        ? payData.value_total - payData.value_descont
        : payData.value_total;

      if (indexRef === 0) {
        if (value < valueTotalPay) {
          const valueSecond = valueTotalPay - value;
          if (formOfPayment.length === 1) {
            setFormOfPayment(prevState => [
              {
                ...prevState[0],
                subtotal: {
                  value,
                  value_formatted: FormattedUtils.formattedValue(value),
                },
                ...(prevState[0].received && {
                  change_value: {
                    value: prevState[0].received.value - value,
                    value_formatted:
                      prevState[0].received.value - value > 0
                        ? FormattedUtils.formattedValue(
                            prevState[0].received.value - value,
                          )
                        : ' ',
                  },
                }),
              },
              {
                type: '',
                subtotal: {
                  value: valueSecond,
                  value_formatted: FormattedUtils.formattedValue(valueSecond),
                },
              },
            ]);
          } else {
            setFormOfPayment(prevState =>
              prevState.map((prev, index) =>
                index === 1
                  ? {
                      ...prev,
                      type: prev.type,
                      subtotal: {
                        value: valueSecond,
                        value_formatted: FormattedUtils.formattedValue(
                          valueSecond,
                        ),
                      },
                      ...(prev.received && {
                        change_value: {
                          value: prev.received.value - valueSecond,
                          value_formatted:
                            prev.received.value - valueSecond > 0
                              ? FormattedUtils.formattedValue(
                                  prev.received.value - valueSecond,
                                )
                              : ' ',
                        },
                      }),
                    }
                  : {
                      ...prev,
                      subtotal: {
                        value,
                        value_formatted: FormattedUtils.formattedValue(value),
                      },
                      ...(prev.received && {
                        change_value: {
                          value: prev.received.value - value,
                          value_formatted:
                            prev.received.value - value > 0
                              ? FormattedUtils.formattedValue(
                                  prev.received.value - value,
                                )
                              : ' ',
                        },
                      }),
                    },
              ),
            );
          }
        } else {
          setFormOfPayment(prevState => [
            {
              ...prevState[0],
              subtotal: {
                value,
                value_formatted: FormattedUtils.formattedValue(value),
              },
              ...(prevState[0].received && {
                change_value: {
                  value: prevState[0].received.value - value,
                  value_formatted:
                    prevState[0].received.value - value > 0
                      ? FormattedUtils.formattedValue(
                          prevState[0].received.value - value,
                        )
                      : ' ',
                },
              }),
            },
          ]);

          if (value > valueTotalPay)
            formRef.current?.setErrors({
              [`subtotal[${indexRef}]`]: 'Valor maior que total',
            });
        }
      } else {
        const sumSubTotal = formOfPayment.reduce(
          (prevValue, subTotal, index) => {
            if (subTotal.type !== '') {
              return index === indexRef
                ? prevValue + value
                : prevValue + subTotal.subtotal.value;
            }
            return prevValue;
          },
          0,
        );

        setFormOfPayment(prevState => [
          prevState[0],
          {
            ...prevState[1],
            subtotal: {
              value,
              value_formatted: FormattedUtils.formattedValue(value),
            },
            ...(prevState[1].received && {
              change_value: {
                value: prevState[1].received.value - value,
                value_formatted:
                  prevState[1].received.value - value > 0
                    ? FormattedUtils.formattedValue(
                        prevState[1].received.value - value,
                      )
                    : ' ',
              },
            }),
          },
        ]);

        if (sumSubTotal > valueTotalPay) {
          formRef.current?.setErrors({
            [`subtotal[${indexRef}]`]: 'Valor maior que total',
          });
        }
      }
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
              value_formatted:
                newChangeValue > 0
                  ? FormattedUtils.formattedValue(newChangeValue)
                  : ' ',
            },
          };
        }
        return prev;
      }),
    );
  }, []);

  useEffect(() => {
    const sumSubTotal = formOfPayment.reduce((prevValue, subTotal) => {
      return subTotal.type !== ''
        ? prevValue + subTotal.subtotal.value
        : prevValue;
    }, 0);

    const valueTotalPay = payData.value_descont
      ? payData.value_total - payData.value_descont
      : payData.value_total;

    setTextButton(
      sumSubTotal !== 0 &&
        sumSubTotal < valueTotalPay &&
        payData.close_id.length === 1
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
            <h2>Valor Total a se Pago:</h2>
            <h1>{payData.value_formatted}</h1>
          </HeaderLeft>

          <HeaderRight>
            <Input
              mask=""
              name="discount"
              isCurrency
              placeholder="Desconto"
              hasOnChange={{
                fnOnChange: fnOnChangeDescont,
              }}
              icon={FiScissors}
              styleInput={{ width: 124, flex: 'auto' }}
            />
          </HeaderRight>
        </RowHeaderPay>

        {formOfPayment.map((formPay, index) => (
          <Fragment key={String(index)}>
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

            {formPay.type !== '' && (
              <RowInput>
                <Input
                  mask=""
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
                      mask=""
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
                      mask=""
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
                  <Select
                    name={`type_card[${index}]`}
                    hasTitle="Tipo do Cartão"
                    style={{ flex: 1 }}
                  >
                    <option value="">Selecione</option>
                    <option value="visa-debit">Cartão VISA Débito</option>
                    <option value="visa-credit">Cartão VISA Crédito</option>
                    <option value="master-debit">
                      Cartão MASTERCARD Débito
                    </option>
                    <option value="master-credit">
                      Cartão MASTERCARD Crédito
                    </option>
                    <option value="elo-debit">Cartão ELO Débito</option>
                    <option value="elo-credit">Cartão ELO Crédito</option>
                  </Select>
                )}
              </RowInput>
            )}
          </Fragment>
        ))}

        <Button type="submit" loading={loading}>
          {textButton}
        </Button>
      </Form>
    </Container>
  );
};

export default MakePay;
