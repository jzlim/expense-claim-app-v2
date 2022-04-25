import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DEFAULT_CURRENCY, FIXER_API_CONVERSION_URL, FIXER_API_KEY, FIXER_API_SYMBOL_URL } from '../core/constants/constants';
import { HttpService } from '../core/service/http.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(public httpService: HttpService) { }

  // claimItem/getClaimItems
  getClaimItems() {
    try {
      return new Observable((observer) => {
        const url = 'claimItem/getClaimItems';
        const obs = this.httpService.httpClientGet(url);
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

  // expenseClaim/getAllExpenseClaims
  // expenseClaim/getExpenseClaimById
  // expenseClaim/deleteExpenseClaim
  // expenseClaim/saveExpenseClaim

  getAllExpenseClaims(req: any) {
    try {
      return new Observable((observer) => {
        const url = 'expenseClaim/getAllExpenseClaims';
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

  getExpenseClaimById(req: any) {
    try {
      return new Observable((observer) => {
        const url = 'expenseClaim/getExpenseClaimById';
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

  deleteExpenseClaim(req: any) {
    try {
      return new Observable((observer) => {
        const url = 'expenseClaim/deleteExpenseClaim';
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

  saveExpenseClaim(req: any) {
    try {
      return new Observable((observer) => {
        const url = 'expenseClaim/saveExpenseClaim';
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

  getUserInformation(req: any) {
    try {
      return new Observable((observer) => {
        const url = 'user/getUserInformation';
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

  // FIXER APIs
  getCurrencies() {
    try {
      return new Observable((observer) => {
        const url = `${FIXER_API_SYMBOL_URL}${FIXER_API_KEY}`;
        const obs = this.httpService.httpGet(url);
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

  currencyConversion(req: any) {
    try {
      return new Observable((observer) => {
        const url = `${FIXER_API_CONVERSION_URL}${FIXER_API_KEY}&from=${req.from}&to=${DEFAULT_CURRENCY}&amount=${req.amount}`;
        const obs = this.httpService.httpGet(url, req);
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
