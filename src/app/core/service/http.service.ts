import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private httpClient: HttpClient;

  constructor(private http: HttpClient, private handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  httpClientGet(url: string, params?: any) {
    url = `${environment.apiBaseUrl}${url}`;
    if (params) {
      params = new HttpParams({ fromObject: params });
    }
    return this.http.get(url, { params });
  }

  httpClientPost(url: string, payload: any) {
    url = `${environment.apiBaseUrl}${url}`;
    return this.http.post(url, payload);
  }

  httpGet(url: string, params?: any) {
    if (params) {
      params = new HttpParams({ fromObject: params });
    }
    return this.httpClient.get(url, { params });
  }
}
