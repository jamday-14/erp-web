import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountTypes'
})
export class AccountTypesPipe implements PipeTransform {

  transform(data: any, accountTypeId: number): any {
    return data.filter((item) => {
      return (item.accountTypeId == accountTypeId);
    });
  }

}
