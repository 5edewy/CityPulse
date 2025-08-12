import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {useStore} from '../store';

type Fail = {message: string; status?: number; validationErrors?: any};

type RequestAPICallerParams<T = any> = {
  requestConfig: AxiosRequestConfig;
  successCallback?: (response: AxiosResponse<T>) => void;
  requestFailedCallback?: (error: Fail) => void;
};

export async function requestAPICaller<T = any>({
  requestConfig,
  successCallback,
  requestFailedCallback,
}: RequestAPICallerParams<T>): Promise<T> {
  const {user, token} = useStore.getState();

  try {
    const headers: Record<string, string> = {
      accept: 'application/json',
      'x-platform': 'mobile',
      'Content-Type': 'application/json',
    };

    const response = await axios({
      ...requestConfig,
      headers: {...headers, ...(requestConfig.headers || {})},
    });

    if (typeof successCallback === 'function')
      successCallback(response as AxiosResponse<T>);
    return response.data as T;
  } catch (err: any) {
    let message = 'An error occurred';
    let validationErrors: Record<string, any> = {};
    const isAxios = !!err?.isAxiosError;

    if (isAxios) {
      const d = err?.response?.data;
      message =
        d?.resultMessage ||
        d?.message ||
        (typeof d === 'string' ? d : '') ||
        err?.message ||
        message;

      if (d?.errors) validationErrors = d.errors;
      if (d?.resultStatus === false && d?.resultOutput)
        validationErrors = d.resultOutput;

      requestFailedCallback?.({
        message,
        status: err?.response?.status,
        validationErrors,
      });
    } else if (!err?.response) {
      message = 'Network error occurred or no response from the server.';
    }

    if (Object.keys(validationErrors).length > 0) throw validationErrors;
    throw new Error(message);
  }
}
