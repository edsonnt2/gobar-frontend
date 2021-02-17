import FormattedUtils from '~/shared/utils/formattedUtils';
import { FormOfPayment, PayData } from '..';

interface OnchangeDiscont {
  formOfPayment: FormOfPayment[];
  payData: PayData;
  value: number;
}

export default function onChangeDiscont({
  formOfPayment,
  payData,
  value,
}: OnchangeDiscont): FormOfPayment[] {
  const valueWithDiscont = payData.value_total - value;
  if (formOfPayment.length) {
    return [
      {
        ...formOfPayment[0],
        subtotal: {
          value: valueWithDiscont,
          value_formatted: FormattedUtils.formattedValue(valueWithDiscont),
        },
        ...(formOfPayment[0].received && {
          change_value: {
            value: formOfPayment[0].received.value - valueWithDiscont,
            value_formatted:
              formOfPayment[0].received.value - valueWithDiscont > 0
                ? FormattedUtils.formattedValue(
                    formOfPayment[0].received.value - valueWithDiscont,
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
        value: valueWithDiscont - formOfPayment[0].subtotal.value,
        value_formatted: FormattedUtils.formattedValue(
          valueWithDiscont - formOfPayment[0].subtotal.value,
        ),
      },
      ...(formOfPayment[1].received && {
        change_value: {
          value:
            formOfPayment[1].received.value -
            (valueWithDiscont - formOfPayment[0].subtotal.value),
          value_formatted:
            formOfPayment[1].received.value -
              (valueWithDiscont - formOfPayment[0].subtotal.value) >
            0
              ? FormattedUtils.formattedValue(
                  formOfPayment[1].received.value -
                    (valueWithDiscont - formOfPayment[0].subtotal.value),
                )
              : ' ',
        },
      }),
    },
  ];
}
