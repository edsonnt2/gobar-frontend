import { ApiService, Business } from '@/services';

export interface RegisterBusinessDTO {
  file?: File;
  name: string;
  category?: string;
  cell_phone?: string;
  phone?: string;
  taxId: string;
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface BusinessResponse {
  business: Business;
  token: string;
}

export class BusinessService {
  public static async registerBusiness(
    data: RegisterBusinessDTO & { categories: string[] },
  ): Promise<BusinessResponse | undefined> {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('categories', data.categories.join(','));
    formData.append('taxId', data.taxId);
    formData.append('zip_code', data.zip_code);
    formData.append('street', data.street);
    formData.append('number', data.number);
    formData.append('neighborhood', data.neighborhood);
    formData.append('city', data.city);
    formData.append('state', data.state);
    if (data.complement) formData.append('complement', data.complement);
    if (data.cell_phone) formData.append('cell_phone', data.cell_phone);
    if (data.phone) formData.append('phone', data.phone);
    if (data.file) formData.append('avatar', data.file);

    const response = await ApiService.post<BusinessResponse>('business', formData);

    return response?.data;
  }

  public static async fetchCategories(searchCategory: string): Promise<{ name: string }[]> {
    const response = await ApiService.get<{ name: string }[]>('business/categories/search', {
      params: {
        search: searchCategory,
      },
    });

    return response.data;
  }

  public static async updateNumberOfTable(table: string): Promise<Business | undefined> {
    const response = await ApiService.patch<Business>('business/update-table', { table });

    return response?.data;
  }
}
