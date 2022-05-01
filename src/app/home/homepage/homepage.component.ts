import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  providers: []
})
export class HomepageComponent implements OnInit, OnDestroy {

  public expenseClaims: any;

  private user: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private authService: AuthService, private homeService: HomeService, private router: Router) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const obs = this.homeService.getAllExpenseClaims({ id: this.user.id });
    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (resp: any) => {
        this.expenseClaims = resp;
      }
    )
  }

  newExpenseClaim() {
    this.router.navigate(['./home/expenseClaim']);
  }

  viewDetail(expenseClaimId: number) {
    this.router.navigate(['./home/expenseClaim', expenseClaimId]);
  }

  delete(expenseClaimId: number) {
    const obs = this.homeService.deleteExpenseClaim({ id: expenseClaimId });
    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (resp: any) => {
        this.fetchData();
      }
    )
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  
}
