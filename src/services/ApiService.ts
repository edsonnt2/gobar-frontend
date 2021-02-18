import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import EnvConfig from '@/config/EnvConfig';

export default class ApiService {
  private static authorizationJsonContentHeaders(): { Authorization: string } | undefined {
    const token = localStorage.getItem('@goBar:token');
    return token
      ? {
          Authorization: `'Bearer' ${token}`,
        }
      : undefined;
  }

  private static jsonContentHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/json',
    };
  }

  public static async get<T>(resource: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    const headers = {
      ...this.authorizationJsonContentHeaders(),
      ...this.jsonContentHeaders(),
    };

    return axios.get<T>(`${EnvConfig.gobar.baseURL}/${resource}`, {
      ...config,
      headers: { ...headers, ...(config.headers || true) },
    });
  }

  public static async post<T>(
    resource: string,
    data: { [key: string]: string | number },
    config: AxiosRequestConfig = {},
    isMultipart = false,
  ): Promise<AxiosResponse<T>> {
    const headers = {
      ...this.authorizationJsonContentHeaders(),
      ...(!isMultipart ? this.jsonContentHeaders() : {}),
    };

    return axios.post<T>(`${EnvConfig.gobar.baseURL}/${resource}`, data, {
      ...config,
      headers: { ...headers, ...(config.headers || true) },
    });
  }

  public static async remove<T>(resource: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    const headers = {
      ...this.authorizationJsonContentHeaders(),
    };

    return axios.delete<T>(`${EnvConfig.gobar.baseURL}/${resource}`, {
      ...config,
      headers: { ...headers, ...(config.headers || true) },
    });
  }
}
