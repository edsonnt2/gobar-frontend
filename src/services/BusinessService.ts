import { ApiService, Business } from '@/services';

export class BusinessService {
  public static async updateNumberOfTable(table: string): Promise<Business | undefined> {
    const response = await ApiService.patch<Business>('business/update-table', { table });

    return response?.data;
  }
}
