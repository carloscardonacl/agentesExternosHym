import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorsaldo'
})
export class ColorsaldoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
