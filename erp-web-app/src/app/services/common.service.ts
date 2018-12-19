import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  cloneItem(c: any): any {
    let item = {};
    for (let prop in c) {
      item[prop] = c[prop];
    }
    return item;
  }
}
