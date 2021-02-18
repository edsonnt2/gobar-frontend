import axios from 'axios';

import EnvConfig from '@/config/EnvConfig';

export default class CepService {
  public static async fetchAddress<T>(code: string | number): Promise<T | undefined> {
    const { data } = await axios.get<T>(`${EnvConfig.gobar.cep}/${code}`);

    return data;
  }
}
