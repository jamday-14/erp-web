import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
 
  items: any[];
  
  constructor(public api: ApiService) {

  }

  queryItems(params?: any) {
    return this.api.get('maintenance/items', params);
  }

  queryVendorItems(vendorId: number) {
    return this.api.get(`maintenance/vendors/${vendorId}/items`, null, false);
  }

  queryEmployees(params?: any) {
    return this.api.get('maintenance/employees', params);
  }

  queryVendors(params?: any) {
    return this.api.get('maintenance/vendors', params);
  }

  queryCustomers(params?: any) {
    return this.api.get('maintenance/customers', params);
  }

  queryUnits(params?: any) {
    return this.api.get('maintenance/units', params);
  }

  queryCurrencies(params?: any) {
    return this.api.get('maintenance/currencies', params);
  }

  queryCustomerTypes(params?: any) {
    return this.api.get('maintenance/customer-types', params);
  }

  queryBanks(params?: any) {
    return this.api.get('maintenance/banks', params);
  }

  queryPaymentModes(params?: any) {
    return this.api.get('maintenance/payment-modes', params);
  }

  queryPriceCategories(params?: any) {
    return this.api.get('maintenance/price-categories', params);
  }

  queryTerms(params?: any) {
    return this.api.get('maintenance/terms', params);
  }

  queryWarehouses(params?: any) {
    return this.api.get('maintenance/warehouses', params);
  }

  queryAccountTypes(params?: any): any {
    return this.api.get('maintenance/account-types', params);
  }

  addItem(item: any) {
    return this.api.post('maintenance/items', item);
  }

  addEmployee(employee: any) {
    return this.api.post('maintenance/employees', employee);
  }

  addVendor(vendor: any) {
    return this.api.post('maintenance/vendors', vendor);
  }

  addCustomer(customer: any) {
    return this.api.post('maintenance/customers', customer);
  }
}
