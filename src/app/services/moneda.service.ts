import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class MonedaService {

  constructor(private client: HttpClient, private globales: Globales) { }

  private _rutaBase: string = this.globales.ruta + 'php/monedas/';
  private _rutaBaseNueva: string = this.globales.rutaNueva;

  getMonedasPais(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_monedas_por_pais.php', { params: p });
  }

  getMonedasDefauls(): Observable<any> {
    return this.client.get(this._rutaBase + 'get_monedas_defaults.php');
  }

  getMonedasExtranjeras(): Observable<any> {
    return this.client.get(this._rutaBase + 'get_monedas_extranjeras.php');
  }

  getMonedasExtranjerasCompra(): Observable<any> {
    return this.client.get(this._rutaBase + 'get_monedas_extranjeras_compra.php');
  }

  getListaMonedas(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_lista_monedas.php', { params: p });
  }

  getMoneda(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_moneda_by_id.php', { params: p });
  }

  public GetMaximaDiferenciaMonedas(): Observable<any> {
    return this.client.get(this._rutaBase + 'get_maximo_diferencial_monedas.php');
  }

  getMonedas(): Observable<any> {
    return this.client.get(this._rutaBaseNueva + 'monedas');
  }

  // getMonedas():Observable<any>{
  //   return this.client.get(this._rutaBase+'get_monedas.php');
  // }

  saveMoneda(data: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'guardar_moneda.php', data);
  }

  editMoneda(data: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'editar_moneda.php', data);
  }

  cambiarEstadoMoneda(data: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'cambiar_estado_moneda.php', data);
  }

}
