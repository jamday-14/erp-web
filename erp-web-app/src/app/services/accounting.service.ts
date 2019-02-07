import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  
  
  constructor(public api: ApiService) { }

  queryAccounts(): any {
    return this.api.get('accounting/chart-of-accounts', null, false);
  }

  addAccount(request: any) {
    return this.api.post('accounting/chart-of-accounts', request, false);
  }
}
