import { Pipe, PipeTransform } from '@angular/core';
import _ from "lodash";

@Pipe({
  name: 'sumFilter'
})
export class SumFilterPipe implements PipeTransform {

  transform(data: any, key: any): any {
    if (_.isUndefined(data) || _.isUndefined(key))
      return 0;
    var sum = 0;

    _.forEach(data, function (v, k) {
      var val = parseInt(v[key]);
      if (_.isNaN(val))
        val = 0
      sum = sum + val;
    });

    return sum;
  }

}
