import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ToastService {

  
  public _subject = new Subject<object>();
  public event = this._subject.asObservable();
  private ToastObj:any = {
    textos:['Default title', 'Default message'],
    tipo:'warning',
    duracion:0
  };

  constructor() { }

  public ShowToast(data:any) {
    this._setToastData(data);
    this._subject.next(this.ToastObj);
  }

  private _setToastData(data:any){
    this.ToastObj.textos = data.textos;
    this.ToastObj.tipo = data.tipo ? data.tipo : 'default';
    this.ToastObj.duracion = data.duracion ? data.duracion : 3000;
  }

}
