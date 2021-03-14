import ApiService from '@/services/ApiService';

export interface Customer {
  id: string;
  name: string;
  cell_phone: number;
  email: string;
  birthDate: string;
  gender?: 'M' | 'W';
  taxId?: number;
  avatar_url?: string;
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
  customersInBusiness: Customer[];
  customersOtherBusiness: Omit<Customer, 'taxId' | 'command' | 'command_open'>[];
  users: Omit<Customer, 'taxId' | 'command' | 'command_open'>[];
}

export default class CustomerService {
  public static async searchCostumer(search: string): Promise<SearchCostumer> {
    const response = await ApiService.get<SearchCostumer>('customers/search', {
      params: {
        search,
      },
    });

    return response?.data;
  }
}
