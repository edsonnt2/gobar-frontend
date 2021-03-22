import { ApiService } from './ApiService';

interface RegisterTable {
  number: number;
  customer_id: string;
}

export interface EntranceData {
  id: string;
  description: string;
  value: number;
  consume: boolean;
  value_formatted: string;
  consume_formatted?: string;
}

interface Table {
  id: string;
  business_id: string;
  operator_id: string;
  number: number;
  table_customer: {
    created_at: Date | string;
    customer_id: string;
    id: string;
    table_id: string;
    updated_at: Date | string;
  }[];
  created_at: Date | string;
  updated_at: Date | string;
}

export class TableService {
  public static async registerTable(data: RegisterTable): Promise<Table | undefined> {
    const response = await ApiService.post<Table>('tables', data);

    return response?.data;
  }

  public static async fecthTables(): Promise<{ number: string }[]> {
    const response = await ApiService.get<{ number: string }[]>('tables');

    return response.data;
  }

  public static async removeCustomerInTheTable({
    table_id,
    customer_id,
  }: {
    table_id: string;
    customer_id: string;
  }): Promise<void> {
    await ApiService.remove('tables/customers', {
      params: {
        params: {
          table_id,
          customer_id,
        },
      },
    });
  }
}
