import { PaymentService } from '@/services';
import { FormOfPayment, PayData } from '..';

interface SendPayment {
  formOfPayment: FormOfPayment[];
  payData: PayData;
  dataForm: { type_card?: string[] };
}

export default async function sendPayment({
  formOfPayment,
  payData,
  dataForm,
}: SendPayment): Promise<'discount' | 'payment' | { [key: string]: string } | null> {
  if (!formOfPayment.length) return null;

  let errorPays: { [key: string]: string } | undefined;

  const sumSubTotal = formOfPayment.reduce((prevValue, subTotal) => {
    return subTotal.type !== '' ? prevValue + subTotal.subtotal.value : prevValue;
  }, 0);

  const valueTotalPay = payData.value_discont ? payData.value_total - payData.value_discont : payData.value_total;

  formOfPayment.forEach((formOfPay, index) => {
    if (!index) {
      if (!formOfPay?.type) {
        errorPays = {
          [`form_of_payment[${index}]`]: 'Forma de Pagamento é obrigatório',
          ...(errorPays && errorPays),
        };
      } else if (formOfPayment?.length && sumSubTotal > valueTotalPay) {
        errorPays = {
          [`subtotal[${index}]`]: 'SubTotal maior que valor a se pago',
          ...(errorPays && errorPays),
        };
      }
    } else if (payData.close_id.length > 1 && !formOfPay?.type) {
      errorPays = {
        [`form_of_payment[${index}]`]: 'Forma de Pagamento é obrigatório',
        ...(errorPays && errorPays),
      };
    } else if (payData.close_id.length > 1 && sumSubTotal < valueTotalPay) {
      errorPays = {
        [`subtotal[${index}]`]: 'SubTotal menor que valor a se pago',
        ...(errorPays && errorPays),
      };
    } else if (formOfPay?.type && sumSubTotal > valueTotalPay) {
      errorPays = {
        [`subtotal[${index}]`]: 'SubTotal maior que valor a se pago',
        ...(errorPays && errorPays),
      };
    }

    if (formOfPay.type === 'money') {
      if (!formOfPay.received || !formOfPay?.received?.value) {
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
      if (dataForm.type_card && !dataForm?.type_card[index]) {
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
          type_card: dataForm.type_card ? dataForm.type_card[index] : undefined,
        }
      : {
          received: formOfPay.received?.value,
        }),
  }));

  if (sumSubTotal < valueTotalPay) {
    PaymentService.sendDiscountPayment({
      value_total: payData.value_total,
      discount: payData.value_discont,
      command_id: payData.close_id[0],
      payment_discount: formattedFormOfPayment,
    });

    return 'discount';
  }

  PaymentService.sendPayment({
    resource: payData.type,
    value_total: payData.value_total,
    discount: payData.value_discont,
    close_id: payData.close_id,
    payments: formattedFormOfPayment,
  });

  return 'payment';
}
