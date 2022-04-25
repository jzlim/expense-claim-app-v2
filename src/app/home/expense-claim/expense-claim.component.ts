import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ExpenseClaim } from 'src/app/core/model/expense-claim';
import { ExpenseClaimLine } from 'src/app/core/model/expense-claim-line';
import { AuthService } from 'src/app/core/service/auth.service';
import { ExpenseClaimLineComponent } from '../expense-claim-line/expense-claim-line.component';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-expense-claim',
  templateUrl: './expense-claim.component.html',
  styleUrls: ['./expense-claim.component.scss'],
  providers: [DialogService]
})
export class ExpenseClaimComponent implements OnInit, OnDestroy {
  
  public isReadOnly: boolean;
  public currencies: any = [];
  public expenseClaim: ExpenseClaim;
  public expenseClaimLines: ExpenseClaimLine[] = [];
  public userInformation: any;
  private expenseClaimId: string;
  private user: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private authService: AuthService, private homeService: HomeService, private router: Router,
    private route: ActivatedRoute, private dialogService: DialogService) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.fetchCurrencies();
      if (params.get('id')) {
        // existing expense claim
        this.isReadOnly = true;
        this.expenseClaimId = params.get('id');
        this.fetchMasterData();
        this.fetchData();
      } else {
        // new expense claim
        this.initData();
        this.fetchMasterData(true);
      }
    })
  }

  initData() {
    this.expenseClaim = {
      _id: '',
      userId: this.user._id,
      claimDate: new Date(),
      bankAccountName: '',
      bankAccountNumber: '',
      bankCode: '',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      expenseClaimLines: [],
      totalAmount: 0,
    };
  }

  fetchCurrencies() {
    const obs = this.homeService.getCurrencies();
    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (resp: any) => {
        if (resp.success) {
          this.currencies = [ ...Object.keys(resp.symbols) ];
        } else {
          this.currencies = [];
        }
      }
    )
  }

  fetchMasterData(setDefault: boolean = false) {
    const obs = this.homeService.getUserInformation({ userId: this.user._id });
    obs.subscribe(
      (resp: any) => {
        this.userInformation = resp;
        if (setDefault) {
          // set default bank infor based on user's profile
          this.setBankInformation(this.userInformation);
        }
      }
    )
  }

  fetchData() {
    const obs = this.homeService.getExpenseClaimById({ expenseClaimId: this.expenseClaimId });
    obs.subscribe(
      (resp: any) => {
        this.expenseClaim = resp;
        this.expenseClaimLines = this.expenseClaim.expenseClaimLines;
        this.setBankInformation(this.expenseClaim);
      }
    )
  }

  setBankInformation(data: any) {
    this.expenseClaim.bankAccountName = data.bankAccountName;
    this.expenseClaim.bankAccountNumber = data.bankAccountNumber;
    this.expenseClaim.bankCode = data.bankCode;
  }

  manageLine(index?: number, expenseClaimLine?: ExpenseClaimLine) {
    const payload = {
      expenseClaimLine: expenseClaimLine || null,
      currencies: this.currencies,
      isReadOnly: this.isReadOnly
    };
    const ref = this.dialogService.open(ExpenseClaimLineComponent, {
      data: payload,
      header: `${ payload.expenseClaimLine ? (this.isReadOnly ? 'View' : 'Edit') : 'New'} Line`,
      width: '60%'
    });

    ref.onClose.subscribe((resp: any) => {
      if (resp) {
        if (index >= 0) {
          this.expenseClaimLines[index] = resp;
        } else {
          this.expenseClaimLines.push(resp);
        }
      }
  });
  }

  deleteLine(index) {
    this.expenseClaimLines = this.expenseClaimLines.splice(index, 1);
  }

  onSubmit() {
    if (this.expenseClaim.claimDate && this.expenseClaimLines.length > 0) {
      const obj = {
        userId: this.user._id,
        claimDate: this.expenseClaim.claimDate,
        bankAccountName: this.expenseClaim.bankAccountName,
        bankAccountNumber: this.expenseClaim.bankAccountNumber,
        bankCode: this.expenseClaim.bankCode,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        expenseClaimLines: []
      };
      this.expenseClaimLines.forEach(x => {
        let line = x;
        line.createdAt = new Date();
        line.updatedAt = new Date();
        obj.expenseClaimLines.push(line);
      });
      this.save({ expenseClaim: obj });
    }
  }

  save(req: any) {
    const obs = this.homeService.saveExpenseClaim(req);
    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (resp: any) => {
        if (resp) {
          this.back();
        }
      }
    )
  }

  // saveMockData() {
  //   const expenseClaim = {
  //     userId: '6264af1db8a7ecda8fcba336',
  //     claimDate: new Date(),
  //     bankAccountName: 'LIM JING ZHE',
  //     bankAccountNumber: '01234567890',
  //     bankCode: 'TEST_BANK',
  //     expenseClaimLines: []
  //   };
  //   const expenseClaimLine1 = {
  //     expenseClaimId: '',
  //     transactionDate: new Date(),
  //     costCenter: 'COST_CENTER_A',
  //     claimItem: '4165',
  //     currencyCode: 'MYR',
  //     amount: 5440,
  //     gst: 0,
  //     exchangeRate: 1,
  //     totalAmount: 5440,
  //     createdAt: new Date(),
  //     updatedAt: new Date()
  //   }
  //   expenseClaim.expenseClaimLines.push(expenseClaimLine1);
  //   this.save({ expenseClaim })
  // }

  back() {
    this.router.navigate(['./home']);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
