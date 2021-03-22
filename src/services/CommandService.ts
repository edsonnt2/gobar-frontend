import { ApiService, Customer, Product } from '@/services';

interface RegisterCommand {
  customer_id: string;
  number: string;
  entrance_id?: string;
  prepaid_entrance?: boolean;
  value_consume?: string;
}

export interface Command {
  id: string;
  business_id: string;
  customer_id: string;
  operator_id: string;
  number: number;
  customer?: Customer;
  created_at: Date;
  updated_at: Date;
}

interface ProductRegister {
  product_id?: string;
  description?: string;
  value?: number;
  quantity?: string;
}

interface ProductResponse extends Product {
  table_id?: string;
}

interface ProductInCommand extends Product {
  value_formatted: string;
  value_total_formatted: string;
}

export interface CommandOrTableDTO extends Command {
  value_entrance?: number;
  prepaid_entrance?: boolean;
  entrance_consume?: boolean;
  value_consume?: number;
  products: ProductInCommand[];
  value_total: number;
  entrance_formatted?: string;
  value_total_formatted: string;
  spotlight: boolean;
  table_customer?: {
    id: string;
    customer: Customer;
  }[];
}

export interface CommandData extends Omit<CommandOrTableDTO, 'table_customer' | 'products'> {
  command_product: ProductInCommand[];
}

export interface TableData
  extends Omit<
    CommandOrTableDTO,
    'value_entrance' | 'prepaid_entrance' | 'entrance_consume' | 'products' | 'customer' | 'entrance_formatted'
  > {
  table_product: ProductInCommand[];
}

export class CommandService {
  public static async registerCommand(data: RegisterCommand): Promise<Command | undefined> {
    const response = await ApiService.post<Command>('commands', data);

    return response?.data;
  }

  public static async registerProductInCommandOrTable({
    resource,
    command_or_table,
    products,
  }: {
    resource: 'command' | 'table';
    command_or_table: string;
    products: ProductRegister[];
  }): Promise<ProductResponse[]> {
    const response = await ApiService.post<ProductResponse[]>(`${resource}s/products`, {
      [resource]: command_or_table,
      products,
    });

    return response?.data;
  }

  public static async fetchCommands(): Promise<Command[]> {
    const response = await ApiService.get<Command[]>('commands');

    return response.data;
  }

  public static async searchCommands(search: string): Promise<Command[]> {
    const response = await ApiService.get<Command[]>('commands/search', {
      params: {
        search,
      },
    });

    return response.data;
  }

  public static async findCommandByNumber(number: number): Promise<CommandData | undefined> {
    const response = await ApiService.get<CommandData>('commands/find', {
      params: {
        number,
      },
    });

    return response.data;
  }

  public static async findTableByNumber(number: number): Promise<TableData | undefined> {
    const response = await ApiService.get<TableData>('tables/find', {
      params: {
        number,
      },
    });

    return response.data;
  }

  public static async removeProductInCommandOrTable({
    resource,
    id,
    product_id,
  }: {
    resource: string;
    id: string;
    product_id: string;
  }): Promise<void> {
    await ApiService.remove(`${resource}s/products`, {
      params: {
        [`${resource}_id`]: id,
        [`${resource}_product_id`]: product_id,
      },
    });
  }
}
