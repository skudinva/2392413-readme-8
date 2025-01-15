import { AxiosInstance } from 'axios';
import { ApplicationServiceURL } from '../app.config';

export async function checkAuth(axiosRef: AxiosInstance, request: Request) {
  const { data } = await axiosRef.post(
    `${ApplicationServiceURL.Users}/check`,
    {},
    {
      headers: {
        Authorization: request.headers['authorization'],
      },
    }
  );
  return data;
}