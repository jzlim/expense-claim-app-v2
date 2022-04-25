import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { ExpenseCardComponent } from './expense-card/expense-card.component';
import { ExpenseClaimComponent } from './expense-claim/expense-claim.component';
import { ExpenseClaimLineComponent } from './expense-claim-line/expense-claim-line.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [
    HomepageComponent,
    ExpenseCardComponent,
    ExpenseClaimComponent,
    ExpenseClaimLineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    CardModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    DynamicDialogModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule
  ]
})
export class HomeModule { }
