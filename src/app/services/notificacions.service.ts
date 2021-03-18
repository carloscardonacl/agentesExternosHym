import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Globales } from '../shared/globales/globales';

@Injectable()
export class NotificacionsService {
  public user = JSON.parse(localStorage['User']);
  public contadorTraslado = 0;
  public contadorTrasladoCustom = 0;
  public alertasCajas: any = [];

  notifcaciones$ = new Subject<string>()

  constructor(private http: HttpClient, private globales: Globales) {
    setTimeout(() => {
      this.counter();
    }, 15000);
    
  }

  counter() {
    this.http.get(`${this.globales.ruta}/php/trasladocaja/notificaciones_traslado.php`, { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.alertasCajas = data;
      if (this.alertasCajas.length > 0) {
        this.notifcaciones$.next(this.alertasCajas.length)
      } else {
        this.notifcaciones$.next('0');
      }
    });
  }
}
