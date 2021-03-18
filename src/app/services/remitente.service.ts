import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class RemitenteService {

  constructor(private client: HttpClient, private globales: Globales) { }

  private _rutaBase: string = this.globales.ruta + 'php/remitente_externo/';
  private rutaNueva: string = this.globales.rutaNueva;

  getRemitente(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_remitente_by_id_externo.php', { params: p });
  }
  getRemitenteGiro(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_remitente_giros_by_id.php', { params: p });
  }

  getListaRemitentes(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_lista_remitentes.php', { params: p });
  }

  saveRemitente(datos: FormData): Observable<any> {
    return this.client.post(this.rutaNueva + 'remitentes-externo', datos);
  }

  editRemitente(datos: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'editar_remitente_externo.php', datos);
  }

  cambiarEstadoRemitente(data: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'cambiar_estado_remitente.php', data);
  }

}
