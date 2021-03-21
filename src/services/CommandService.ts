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

export class CommandService {
  public static async registerCommand(data: RegisterCommand): Promise<Command | undefined> {
    const response = await ApiService.post<Command>('commands', data);

    return response?.data;
  }
}
