import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/constants';
import { ExpenseClaimLine } from 'src/app/core/model/expense-claim-line';
import { AuthService } from 'src/app/core/service/auth.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-expense-claim-line',
  templateUrl: './expense-claim-line.component.html',
  styleUrls: ['./expense-claim-line.component.scss']
})
export class ExpenseClaimLineComponent implements OnInit, OnDestroy {
  public form: FormGroup
  public expenseClaimLine: ExpenseClaimLine;

  public currencies: any = [];
  public selectedCurrency: any;
  public exchangeRate: number = 1;
  public totalAmount: number;

  public isSubmitted: boolean;
  public isReadOnly: boolean;
  private user: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private ref: DynamicDialogRef, private dialogConfig: DynamicDialogConfig, private homeService: HomeService,
    private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.expenseClaimLine = this.dialogConfig.data.expenseClaimLine;
    this.currencies = this.dialogConfig.data.currencies;
    this.isReadOnly = this.dialogConfig.data.isReadOnly;

    this.buildForm();
    if (this.expenseClaimLine) {
      this.setData(this.expenseClaimLine);
    } else {
      this.setCurrency(DEFAULT_CURRENCY);
    }
    this.setupCurrencyConversionTrigger();
  }

  buildForm() {
    this.form = this.fb.group({
      transactionDate: [null, Validators.required],
      costCenter: ['', Validators.required],
      claimItem: ['', Validators.required],
      description: ['', Validators.required],
      currency: [null, Validators.required],
      amount: [0, Validators.required],
      gst: [0, Validators.required]
    })
  }

  setData(expenseClaimLine: ExpenseClaimLine) {
    this.TRANSACTION_DATE.setValue(new Date(expenseClaimLine.transactionDate));
    this.COST_CENTER.setValue(expenseClaimLine.costCenter);
    this.CLAIM_ITEM.setValue(expenseClaimLine.claimItem);
    this.DESCRIPTION.setValue(expenseClaimLine.description);

    const selectedCurrency = this.currencies.find(x => x === expenseClaimLine.currencyCode);
    this.setCurrency(selectedCurrency);

    this.AMOUNT.setValue(expenseClaimLine.amount);
    this.GST.setValue(expenseClaimLine.gst);
    this.exchangeRate = expenseClaimLine.exchangeRate;
    this.totalAmount = expenseClaimLine.totalAmount;
  }
  
  setCurrency(currency: string) {
    this.CURRENCY.setValue(currency);
  }

  setupCurrencyConversionTrigger() {
    this.form.get("currency").valueChanges.subscribe(x => {
       this.updateTotalAmount();
    })
    this.form.get("amount").valueChanges.subscribe(x => {
       this.updateTotalAmount();
    })
    this.form.get("gst").valueChanges.subscribe(x => {
       this.updateTotalAmount();
    })
  }

  updateTotalAmount() {
    if ((this.AMOUNT.value || this.GST.value) && this.CURRENCY.value) {
      let totalBeforeConversion = 0;
      if (this.AMOUNT.value) {
        totalBeforeConversion += this.AMOUNT.value;
      } 
      if (this.GST.value) {
        totalBeforeConversion += this.GST.value;
      }
      this.currencyConversion(totalBeforeConversion);
    } else {
      // reset exchange rate and total amount since required data is not completed
      this.exchangeRate = 1;
      this.totalAmount = NaN;
    }
  }

  currencyConversion(total: number) {
    const req = {
      from: this.CURRENCY.value,
      amount: total
    }
    const obs = this.homeService.currencyConversion(req);
    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (resp: any) => {
        if (resp.success) {
          this.exchangeRate = resp.info.rate;
          this.totalAmount = resp.result;
        } else {
          this.exchangeRate = 1;
          this.totalAmount = NaN;
        }
      }
    )
  }

  hasError(ctrl: any) {
    return ctrl && ctrl.invalid && this.isSubmitted;
  }

  save() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const obj = {
        transactionDate: this.TRANSACTION_DATE.value,
        costCenter: this.COST_CENTER.value,
        claimItem: this.CLAIM_ITEM.value,
        description: this.DESCRIPTION.value,
        currencyCode: this.CURRENCY.value,
        amount: this.AMOUNT.value,
        gst: this.GST.value,
        exchangeRate: this.exchangeRate,
        totalAmount: this.totalAmount
      };
      this.ref.close(obj);
    }
  }

  onCancel() {
    this.ref.close();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get TRANSACTION_DATE() { return this.form.get('transactionDate') }
  get COST_CENTER() { return this.form.get('costCenter') }
  get CLAIM_ITEM() { return this.form.get('claimItem') }
  get DESCRIPTION() { return this.form.get('description') }
  get CURRENCY() { return this.form.get('currency') }
  get AMOUNT() { return this.form.get('amount') }
  get GST() { return this.form.get('gst') }
}
