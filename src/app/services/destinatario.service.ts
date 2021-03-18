import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class DestinatarioService {

  private _rutaBase:string = this.globales.ruta+'php/destinatario_externo';

  constructor(private client:HttpClient, private globales:Globales) { }

  getDestinatario(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_destinatario_externo_by_id.php', {params:p});
  }

  getDestinatarios():Observable<any>{
    return this.client.get(this._rutaBase+'/get_destinatarios.php');
  }

  getListaDestinatarios(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_lista_destinatarios.php', {params:p});
  }
  getListaDestinatariosCustom(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/lista_destinatarios_custom.php', {params:p});
  }

  saveDestinatario(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/guardar_destinatario_externo.php', datos);
  }

  editDestinatario(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/editar_destinatario_nuevo.php', data);
  }

  cambiarEstadoDestinatario(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/cambiar_estado_destinatario.php', datos);
  }
  cambiarEstadoDestinatarioCustom(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/cambiar_estado_destinatario_custom.php', datos);
  }

  filtrarDestinatario(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/destinatarios/filtrar_destinatarios.php', {params:p});
  }

  validarExistenciaDestinatario(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/validar_existencia_destinatario.php', { params:p});
  }
  
  public GetCuentasDestinatarios(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/destinatarios/get_cuentas_destinatarios.php', { params:p});
  }
}
