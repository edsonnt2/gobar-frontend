import { ApiService } from './ApiService';

interface RegisterCommand {
  customer_id: string;
  number: string;
  entrance_id?: string;
  prepaid_entrance?: boolean;
  value_consume?: string;
}

interface Command {
  id: string;
  business_id: string;
  customer_id: string;
  operator_id: string;
  number: number;
  created_at: Date;
  updated_at: DataCue;
}

interface ProductRegister {
  product_id?: string;
  description?: string;
  value?: number;
  quantity?: string;
}

interface ProductResponse {
  id: string;
  command_id?: string;
  table_id?: string;
  product_id?: string;
  operator_id: string;
  value: string;
  quantity: number;
  description: string;
  label_description: string;
  created_at: string;
  updated_at: string;
}

export interface SearchProduct {
  id?: string;
  image_url?: string;
  description: string;
  quantity: number;
  internal_code: string;
  sale_value: number;
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

  public static async findProductByInternalCode(internal_code: string): Promise<SearchProduct | undefined> {
    const response = await ApiService.get<SearchProduct>('products/find', {
      params: {
        internal_code,
      },
    });

    return response?.data;
  }

  public static async searchProducts(search: string): Promise<SearchProduct[]> {
    const response = await ApiService.get<SearchProduct[]>('products/search', {
      params: {
        search,
      },
    });

    return response?.data;
  }
}
