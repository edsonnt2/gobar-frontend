import axios, { AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';

import EnvConfig from '@/config/EnvConfig';
import InterceptorUtils from '@/utils/interceptorUtils';

export default class ApiService {
  private static interceptor(): AxiosStatic {
    const interceptorUtils = new InterceptorUtils();

    axios.interceptors.response.use(
      response => interceptorUtils.response(response),
      error => interceptorUtils.error(error),
    );

    axios.interceptors.request.use(
      request => interceptorUtils.request(request),
      error => interceptorUtils.error(error),
    );

    return axios;
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
    const api = this.interceptor();

    const headers = {
      ...this.authorizationJsonContentHeaders(),
      ...this.jsonContentHeaders(),
    };

    return api.get<T>(`${EnvConfig.gobar.baseURL}/${resource}`, {
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
    const api = this.interceptor();

    const headers = {
      ...this.authorizationJsonContentHeaders(),
      ...(!isMultipart ? this.jsonContentHeaders() : {}),
    };

    return api.post<T>(`${EnvConfig.gobar.baseURL}/${resource}`, data, {
      ...config,
      headers: { ...headers, ...(config.headers || true) },
    });
  }

  public static async remove<T>(resource: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    const api = this.interceptor();

    const headers = {
      ...this.authorizationJsonContentHeaders(),
    };

    return api.delete<T>(`${EnvConfig.gobar.baseURL}/${resource}`, {
      ...config,
      headers: { ...headers, ...(config.headers || true) },
    });
  }
}
