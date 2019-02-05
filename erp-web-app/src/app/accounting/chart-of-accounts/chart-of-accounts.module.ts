import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsComponent } from './assets/assets.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { EquitiesComponent } from './equities/equities.component';
import { IncomeComponent } from './income/income.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { Routes, RouterModule } from '@angular/router';
import { ChartOfAccountsComponent } from './chart-of-accounts.component';

export const routes: Routes = [
  {
    path: '',
    component: ChartOfAccountsComponent,
    children: [
      { path: '', redirectTo: 'assets', pathMatch: 'full' },
      { path: 'assets', component: AssetsComponent },
      { path: 'liabilities', component: LiabilitiesComponent },
      { path: 'equities', component: EquitiesComponent },
      { path: 'income', component: IncomeComponent },
      { path: 'expenses', component: ExpensesComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AssetsComponent, LiabilitiesComponent, EquitiesComponent, IncomeComponent, ExpensesComponent, ChartOfAccountsComponent]
})
export class ChartOfAccountsModule { }
