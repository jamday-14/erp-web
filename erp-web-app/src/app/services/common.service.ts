import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private datePipe: DatePipe) { }

  cloneItem(c: any): any {
    let item = {};
    for (let prop in c) {
      item[prop] = c[prop];
    }
    return item;
  }

  toLocaleDate(date) {
    return this.datePipe.transform(new Date(date), 'longDate', 'GMT+16');
  }
}
