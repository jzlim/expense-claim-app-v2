import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor() { }

  setSession(resp: any) {
    localStorage.setItem('access_token', resp.accessToken);
    localStorage.setItem('username', resp.user.username);
    localStorage.setItem('email', resp.user.email);
    localStorage.setItem('id', resp.user.id);
  }

  logout() {
    localStorage.removeItem("access_token");
  }

  getUser() {
    return {
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      id: localStorage.getItem('id')
    };
  }
}
