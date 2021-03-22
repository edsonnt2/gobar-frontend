import { ApiService } from './ApiService';

type TypeForm = 'money' | 'card' | '';

interface PaymentData {
  type_card?: string;
  received?: number;
  type: 'money' | 'card' | '';
  subtotal: number;
}

interface SendPayment {
  resource: 'command' | 'table' | 'account';
  close_id: string[];
  value_total: number;
  payments: PaymentData[];
  discount?: number;
}

interface SendDiscountPayment {
  value_total: number;
  discount?: number;
  command_id: string;
  payment_discount: PaymentData[];
}

export class PaymentService {
  public static async sendDiscountPayment({
    command_id,
    payment_discount,
    value_total,
    discount,
  }: SendDiscountPayment): Promise<any> {
    const response = await ApiService.post('payments/discounts', {
      value_total,
      discount,
      command_id,
      payment_discount,
    });

    console.log(response.data);

    return response.data;
  }

  public static async sendPayment({ resource, value_total, discount, close_id, payments }: SendPayment): Promise<any> {
    const response = await ApiService.post(`payments/${resource}s`, {
      value_total,
      discount,
      [`${resource}_ids`]: close_id,
      [`payment_${resource}s_closure`]: payments,
    });

    console.log(response.data);

    return response.data;
  }
}
