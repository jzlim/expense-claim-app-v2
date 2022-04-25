import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../core/service/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public httpService: HttpService) { }

  login(req: any) {
    try {
      return new Observable((observer) => {
        const url = 'user/login';
        const obs = this.httpService.httpClientPost(url, req);
        obs.subscribe({
          next: (v) => observer.next(v),
          error: (e) => observer.error(e),
          complete: () => observer.complete()
        })
      })
    } catch (error) {
      throw error;
    }
  }
}
