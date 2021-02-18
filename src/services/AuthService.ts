import ApiService from './ApiService';

interface User {
  id: string;
  name: string;
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
  user: User;
  token: string;
}

export default class AuthService {
  public static async authenticate(data: {
    cellPhoneOrEmail: string;
    password: string;
  }): Promise<Authenticate | undefined> {
    const response = await ApiService.post<Authenticate>('sessions', data);

    return response?.data;
  }
}
