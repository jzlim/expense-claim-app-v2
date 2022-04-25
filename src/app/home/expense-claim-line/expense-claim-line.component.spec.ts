import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseClaimLineComponent } from './expense-claim-line.component';

describe('ExpenseClaimLineComponent', () => {
  let component: ExpenseClaimLineComponent;
  let fixture: ComponentFixture<ExpenseClaimLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseClaimLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseClaimLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
