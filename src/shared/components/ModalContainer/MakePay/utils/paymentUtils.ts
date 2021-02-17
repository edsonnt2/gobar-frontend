import api from '~/shared/services/api';
import FormattedUtils from '~/shared/utils/formattedUtils';
import { FormOfPayment, PayData, FnOnChange } from '..';

interface SendPayment {
  formOfPayment: FormOfPayment[];
  payData: PayData;
  dataForm: { type_card?: string[] };
}

interface OnChangePayment extends FnOnChange {
  formOfPayment: FormOfPayment[];
  valueTotalPay: number;
}

export default class PaymentUtils {
  public static async sendPayment({
    formOfPayment,
    payData,
    dataForm,
  }: SendPayment): Promise<
    'discount' | 'payment' | { [key: string]: string } | null
  > {
    if (!formOfPayment.length) return null;

    let errorPays: { [key: string]: string } | undefined;

    const sumSubTotal = formOfPayment.reduce((prevValue, subTotal) => {
      return subTotal.type !== ''
        ? prevValue + subTotal.subtotal.value
        : prevValue;
    }, 0);

    const valueTotalPay = payData.value_descont
      ? payData.value_total - payData.value_descont
      : payData.value_total;

    formOfPayment.forEach((formOfPay, index) => {
      if (index === 0) {
        if (formOfPay.type === '') {
          errorPays = {
            [`form_of_payment[${index}]`]: 'Forma de Pagamento é obrigatório',
            ...(errorPays && errorPays),
          };
        } else if (formOfPayment.length === 1 && sumSubTotal > valueTotalPay) {
          errorPays = {
            [`subtotal[${index}]`]: 'SubTotal maior que valor a se pago',
            ...(errorPays && errorPays),
          };
        }
      } else if (payData.close_id.length > 1 && formOfPay.type === '') {
        errorPays = {
          [`form_of_payment[${index}]`]: 'Forma de Pagamento é obrigatório',
          ...(errorPays && errorPays),
        };
      } else if (payData.close_id.length > 1 && sumSubTotal < valueTotalPay) {
        errorPays = {
          [`subtotal[${index}]`]: 'SubTotal menor que valor a se pago',
          ...(errorPays && errorPays),
        };
      } else if (formOfPay.type !== '' && sumSubTotal > valueTotalPay) {
        errorPays = {
          [`subtotal[${index}]`]: 'SubTotal maior que valor a se pago',
          ...(errorPays && errorPays),
        };
      }

      if (formOfPay.type === 'money') {
        if (!formOfPay.received || formOfPay.received.value === 0) {
          errorPays = {
            [`received[${index}]`]: 'Valor Recebido é obrigatório',
            ...(errorPays && errorPays),
          };
        } else if (formOfPay.received.value < formOfPay.subtotal.value) {
          errorPays = {
            [`received[${index}]`]: 'Valor Recebido menor que SubTotal',
            ...(errorPays && errorPays),
          };
        }
      } else if (formOfPay.type === 'card') {
        if (dataForm.type_card && dataForm.type_card[index] === '') {
          errorPays = {
            [`type_card[${index}]`]: 'Tipo do Cartão é obrigatório',
            ...(errorPays && errorPays),
          };
        }
      }
    });

    if (errorPays) return errorPays;

    const formattedFormOfPayment = formOfPayment.map((formOfPay, index) => ({
      type: formOfPay.type,
      subtotal: formOfPay.subtotal.value,
      ...(formOfPay.type === 'card'
        ? {
            type_card: dataForm.type_card
              ? dataForm.type_card[index]
              : undefined,
          }
        : {
            received: formOfPay.received?.value,
          }),
    }));

    if (sumSubTotal < valueTotalPay) {
      api.post('payments/discounts', {
        value_total: payData.value_total,
        discount: payData.value_descont,
        command_id: payData.close_id[0],
        payment_discount: formattedFormOfPayment,
      });

      return 'discount';
    }

    api.post(`payments/${payData.type}s`, {
      value_total: payData.value_total,
      discount: payData.value_descont,
      [`${payData.type}_ids`]: payData.close_id,
      [`payment_${payData.type}s_closure`]: formattedFormOfPayment,
    });

    return 'payment';
  }

  public static async onChangePayment({
    valueTotalPay,
    indexRef,
    value,
    formOfPayment,
  }: OnChangePayment): Promise<FormOfPayment[]> {
    if (indexRef === 0) {
      if (value < valueTotalPay) {
        const valueSecond = valueTotalPay - value;
        if (formOfPayment.length) {
          return [
            {
              ...formOfPayment[0],
              subtotal: {
                value,
                value_formatted: FormattedUtils.formattedValue(value),
              },
              ...(formOfPayment[0].received && {
                change_value: {
                  value: formOfPayment[0].received.value - value,
                  value_formatted:
                    formOfPayment[0].received.value - value > 0
                      ? FormattedUtils.formattedValue(
                          formOfPayment[0].received.value - value,
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
          ];
        }

        return formOfPayment.map((prev, index) =>
          index === 1
            ? {
                ...prev,
                type: prev.type,
                subtotal: {
                  value: valueSecond,
                  value_formatted: FormattedUtils.formattedValue(valueSecond),
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
        );
      }

      return [
        {
          ...formOfPayment[0],
          subtotal: {
            value,
            value_formatted: FormattedUtils.formattedValue(value),
          },
          ...(formOfPayment[0].received && {
            change_value: {
              value: formOfPayment[0].received.value - value,
              value_formatted:
                formOfPayment[0].received.value - value > 0
                  ? FormattedUtils.formattedValue(
                      formOfPayment[0].received.value - value,
                    )
                  : ' ',
            },
          }),
        },
      ];
    }

    return [
      formOfPayment[0],
      {
        ...formOfPayment[1],
        subtotal: {
          value,
          value_formatted: FormattedUtils.formattedValue(value),
        },
        ...(formOfPayment[1].received && {
          change_value: {
            value: formOfPayment[1].received.value - value,
            value_formatted:
              formOfPayment[1].received.value - value > 0
                ? FormattedUtils.formattedValue(
                    formOfPayment[1].received.value - value,
                  )
                : ' ',
          },
        }),
      },
    ];
  }
}
