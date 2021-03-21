import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import EnvConfig from '@/config/EnvConfig';

export class ApiService {
  private static Axios(): AxiosInstance {
    return axios.create({
      baseURL: EnvConfig.gobar.baseURL,
    });
  }

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

    return this.Axios().get<T>(resource, {
      ...config,
      headers: { ...headers, ...(config.headers || true) },
    });
  }

  public static async post<T>(
    resource: string,
    data: any | FormData,
    config: AxiosRequestConfig = {},
    isMultipart = false,
  ): Promise<AxiosResponse<T>> {
    const headers = {
      ...this.authorizationJsonContentHeaders(),
      ...(!isMultipart ? this.jsonContentHeaders() : {}),
    };

    return this.Axios().post<T>(resource, data, {
      ...config,
      headers: { ...headers, ...(config.headers || true) },
    });
  }

  public static async patch<T>(
    resource: string,
    data: any | FormData,
    config: AxiosRequestConfig = {},
    isMultipart = false,
  ): Promise<AxiosResponse<T>> {
    const headers = {
      ...this.authorizationJsonContentHeaders(),
      ...(!isMultipart ? this.jsonContentHeaders() : {}),
    };

    return this.Axios().patch<T>(resource, data, {
      ...config,
      headers: { ...headers, ...(config.headers || true) },
    });
  }

  public static async remove<T>(resource: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    const headers = {
      ...this.authorizationJsonContentHeaders(),
    };

    return this.Axios().delete<T>(resource, {
      ...config,
      headers: { ...headers, ...(config.headers || true) },
    });
  }
}
