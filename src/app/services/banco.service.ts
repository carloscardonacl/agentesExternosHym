import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Globales } from '../shared/globales/globales';

@Injectable()
export class BancoService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getListaBancos(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/bancos/get_lista_bancos.php', {params:p});
  }

  getListaBancosByPais(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/bancos/get_lista_bancos_by_pais.php', {params:p});
  }

  getBanco(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/bancos/get_banco_por_id.php', {params:p});
  }

  getIdentificadorBanco(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'/php/bancos/buscar_identificador.php', {params:p});
  }

  saveBanco(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/bancos/guardar_banco.php', data);
  }

  editBanco(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/bancos/editar_banco.php', data);
  }

  cambiarEstadoBanco(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/bancos/cambiar_estado_banco.php', data);
  }

}
