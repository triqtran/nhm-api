import config from '@config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class AxiosServices {

  service: AxiosInstance;
  token = {
    Key: config.AYOTREE_KEY,
    Secret: config.AYOTREE_SECRET,
  };

  constructor(baseURL: string) {
    this.service = axios.create({ baseURL, timeout: 50000, validateStatus: () => false });
    this.service.interceptors.request.use(
      config => {
        config.data["token"] = this.token;
        return config
      },
      error => Promise.reject(error)
    )
  
    // response interceptor
    this.service.interceptors.response.use(
      response => {
        if (response.status != 200) {
          return Promise.reject(response.data)
        }
        return response.data
      },
      error => Promise.reject(error)
    );
  }

  post<Req, Res> (url: string, body?: Req) {
    return this.service({ url, data: body, method: 'post' }).then(
      res => (res as AxiosResponse<Res>)
    );
  }

  get (url: string) {
    return this.service({ url, method: 'get' });
  }
}
