import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class CupoAgente {

  private _rutaBase:string = this.globales.ruta+'php/agentesexternos';

  constructor(private client:HttpClient, private globales:Globales) { }

  getCupo(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_cupo.php', {params:p});
  }

}
