import axios from 'axios';

import EnvConfig from '@/config/EnvConfig';

export interface CEP {
  cep: string;
  state: string;
  city: string;
  street: string;
  neighborhood: string;
  service: string;
}

export class BrasilAPIService {
  public static async fetchAddress(cep: string | number): Promise<CEP | undefined> {
    const response = await axios.get<CEP>(`${EnvConfig.gobar.cep}/cep/v1/${cep}`);

    return response?.data;
  }
}
