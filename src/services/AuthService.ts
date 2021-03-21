import { ApiService } from './ApiService';

interface User {
  id: string;
  name: string;
  full_name?: string;
  cell_phone: number;
  email: string;
  birthDate: string;
  avatar_url: string;
}

export interface Business {
  id: string;
  name: string;
  avatar_url: string;
  table: number;
}

interface Authenticate {
  token: string;
  user: User;
  business?: Business;
}

export class AuthService {
  public static async authenticate(data: {
    cellPhoneOrEmail: string;
    password: string;
  }): Promise<Authenticate | undefined> {
    const response = await ApiService.post<Authenticate>('sessions', data);

    return response?.data;
  }

  public static async authenticateBusiness(business_id: string): Promise<Authenticate | undefined> {
    const response = await ApiService.post<Authenticate>('business/sessions', { business_id });

    return response?.data;
  }

  public static async fecthSession(): Promise<Authenticate | undefined> {
    const response = await ApiService.get<Authenticate>('sessions');

    return response?.data;
  }

  public static async fecthBussinessSession(): Promise<Business[] | undefined> {
    const response = await ApiService.get<Business[]>('business/user');

    return response?.data;
  }
}
