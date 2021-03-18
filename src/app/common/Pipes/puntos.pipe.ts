import { Pipe, PipeTransform } from '@angular/core';
import { log } from 'util';

@Pipe({
    name: 'puntos'
})

export class PuntosPipe implements PipeTransform {
    transform(value: string, args: any[] = []): string {
        if(value) {
            let val = value.split('.');
            if (!val[1]) {
                val[1] = '00';
            }
            
          return val[0].replace(/\,/g,'.')+','+val[1];
        }
        return '';
    }
}