import { Injectable } from '@angular/core';
import { SwalService } from './swal.service';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class ValidacionService {

  constructor(private swalService:SwalService,
              private client:HttpClient,
              private globales:Globales) { }

  public validateNumber(value:any, campo:string):boolean{
    let type = typeof(value);

    switch (type) {
      case 'string':
        if (value != '') {
          let num = parseFloat(value);
          return this._checkZeroValue(num, campo);
        }else{
          
          this.swalService.ShowMessage(['warning', 'Alerta', 'El valor '+campo+' esta vacio!']);
          return false;
        }

      case 'number':
        return this._checkZeroValue(value, campo);
    
      default:
        this.swalService.ShowMessage(['warning', 'Alerta', 'El valor enviado tiene un formato incorrecto!']);
        return false;
    }
  }

  public validateString(value:string, campo:string = ''):boolean{
    
    if (value.trim() == '') {
      if (campo != '') {
        this.swalService.ShowMessage(['warning', 'Alerta', 'El valor del campo '+campo+' no puede estar vacio!']);
      }else{
        this.swalService.ShowMessage(['warning', 'Alerta', 'El valor no puede estar vacio!']);
      }
      
      return false;
    }else{
      return true;
    }
  }

  private _checkZeroValue(value:number, campo:string):boolean{
    if (value <= 0) {
      this.swalService.ShowMessage(['warning', 'Alerta', campo+' no puede ser 0, por favor verifque!']);
      return false;
    }else{
      return true;
    }
  }

  public ValidateIdentificacion(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'/php/destinatarios/validar_identificacion.php', {params:p});
  }

  public ValidateCuentaBancaria(p:any){
    return this.client.get(this.globales.ruta+'php/bancos/validar_cuenta_bancaria.php', {params:p});
  }
}
