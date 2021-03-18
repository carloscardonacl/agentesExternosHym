import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globales } from '../shared/globales/globales';

@Injectable()
export class TipodocumentoService {

  private _rutaBase:string = this.globales.ruta+'php/tiposdocumentos';

  constructor(private client:HttpClient, private globales:Globales) { }

  getTipoDocumento(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_tipos_documento_by_id.php', {params:p});
  }

  getTiposDocumentoPais(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_tipos_documento_by_pais.php', {params:p});
  }

  getTiposDocumento():Observable<any>{
    return this.client.get(this._rutaBase+'/get_tipo_documento.php');
  }

  getTiposDocumentosNacionales():Observable<any>{
    return this.client.get(this._rutaBase+'/get_tipos_documentos_nacionales.php');
  }

  getListaTiposDocumento(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_lista_tipo_documento.php', {params:p});
  }

  saveTipoDocumento(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/guardar_tipo_documento.php', datos);
  }

  editTipoDocumento(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/editar_tipo_documento.php', data);
  }

  cambiarEstadoTipoDocumento(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/cambiar_estado_tipo_documento.php', datos);
  }

}
