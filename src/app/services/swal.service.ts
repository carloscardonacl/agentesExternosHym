import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';


@Injectable()
export class SwalService {

  public _subject = new Subject<object>();
  public event = this._subject.asObservable();
  private SwalObj: any = {
    type: 'warning',
    title: 'Alerta',
    msg: 'Default message!',
    timer: null,
    html: '<a href="">Link</a>'
  };

  constructor() { }

  public ShowMessage(data: any) {
    this.SetSwalData(data);
    this._subject.next(this.SwalObj);
  }

  private SetSwalData(data: any) {
    if (typeof (data) == 'object') {
      if (Array.isArray(data)) {
        let i = 0;
        for (const key in this.SwalObj) {
          this.SwalObj[key] = data[i];
          i++;
        }
      } else {
        this.SwalObj.type = data.codigo;
        this.SwalObj.title = data.titulo;
        this.SwalObj.msg = data.mensaje;
      }
    }
  }

}
