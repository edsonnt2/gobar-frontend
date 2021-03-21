import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export class InterceptorUtils {
  async request(request: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    return request;
  }

  async response(response: AxiosResponse): Promise<AxiosResponse> {
    const { data, status } = response;

    if (status !== 200) {
      console.log(`Your call generated an exception: ${JSON.stringify(data.message)}`);
    }

    return response;
  }

  async error(error: AxiosError): Promise<AxiosError | AxiosResponse | void> {
    if (error.response) {
      console.log(`Ocorreu um erro ${error.message}`);
    }

    return Promise.reject(error);
  }
}
