import { ApiService } from './ApiService';

export interface RegisterCustomer {
  name: string;
  birthDate: string;
  gender: string;
  cell_phone?: string;
  email?: string;
}

export interface Customer {
  id: string;
  name: string;
  cell_phone: number;
  email: string;
  birthDate: string;
  gender?: 'M' | 'W';
  taxId?: number;
  avatar_url?: string;
  user?: {
    avatar_url?: string;
  };
}

export interface CustomerBusiness extends Customer {
  command: {
    id: string;
    business_id: string;
    number: string;
    command_closure_id?: string;
  }[];
  table_customer: {
    table: {
      id: string;
      business_id: string;
      number: string;
      table_closure_id: string;
    };
  }[];
  command_open: boolean;
  table_number?: string;
}

export interface SearchCostumer {
  customersInBusiness: CustomerBusiness[];
  customersOtherBusiness: Customer[];
  users: Customer[];
}

export class CustomerService {
  public static async fetchCustomer(id: string): Promise<Customer | undefined> {
    const response = await ApiService.get<Customer>(`customers/${id}`);

    return response?.data;
  }

  public static async registerCustomer(
    data: { customer_id: string } & RegisterCustomer,
  ): Promise<Customer | undefined> {
    const response = await ApiService.post<Customer>('customers', data);

    return response?.data;
  }

  public static async searchCostumer(search: string): Promise<SearchCostumer> {
    const response = await ApiService.get<SearchCostumer>('customers/search', {
      params: {
        search,
      },
    });

    return response?.data;
  }
}
