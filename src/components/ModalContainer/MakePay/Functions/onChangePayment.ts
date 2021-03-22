import { FormattedUtils } from '@/utils';
import { FnOnChange, FormOfPayment } from '..';

interface OnChangePayment extends FnOnChange {
  formOfPayment: FormOfPayment[];
  valueTotalPay: number;
}

export default function onChangePayment({
  valueTotalPay,
  indexRef,
  value,
  formOfPayment,
}: OnChangePayment): FormOfPayment[] {
  if (indexRef) {
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
                ? FormattedUtils.formattedValue(formOfPayment[1].received.value - value)
                : ' ',
          },
        }),
      },
    ];
  }

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
                  ? FormattedUtils.formattedValue(formOfPayment[0].received.value - value)
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
                    ? FormattedUtils.formattedValue(prev.received.value - valueSecond)
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
                  prev.received.value - value > 0 ? FormattedUtils.formattedValue(prev.received.value - value) : ' ',
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
              ? FormattedUtils.formattedValue(formOfPayment[0].received.value - value)
              : ' ',
        },
      }),
    },
  ];
}
