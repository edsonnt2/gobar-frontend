import { ApiService } from './ApiService';

export interface Entrance {
  id: string;
  description: string;
  value: number;
  consume: boolean;
  value_formatted: string;
  consume_formatted?: string;
}

export class EntranceService {
  public static async fetchEntrance(): Promise<Entrance[]> {
    const response = await ApiService.get<Entrance[]>('entrance');

    return response.data;
  }

  public static async registerEntrance(data: {
    description: string;
    value: string;
    consume: boolean;
  }): Promise<Entrance | undefined> {
    const response = await ApiService.post<Entrance>('entrance', data);

    return response?.data;
  }

  public static async removeEntrance(id: string): Promise<void> {
    await ApiService.remove(`entrance/${id}`);
  }
}
