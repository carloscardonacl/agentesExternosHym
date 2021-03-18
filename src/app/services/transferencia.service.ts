import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class TransferenciaService {

  private _rutaBase:string = this.globales.ruta+'php/transferencias/';

  constructor(private client:HttpClient, private globales:Globales) { }

  getAllTransferencias():Observable<any>{
    return this.client.get(this._rutaBase+'lista_transferencias_general.php');
  } 
  
  public GetAllTransferenciasFiltro(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'lista_transferencias_general.php', {params:p});
  } 

  public GetInfoCompany():Observable<any>{

    return this.client.get(this.globales.ruta+'php/configuracion/getInfoCompany.php');
  } 

  getDetalleTransferencia(idTransferencia:string):Observable<any>{
    let p = {id_transferencia:idTransferencia};
    return this.client.get(this._rutaBase+'detalle_transferencia.php', {params:p});
  }

  getDestinatariosTransferencia(idTransferencia:string):Observable<any>{
    let p = {id_transferencia:idTransferencia};
    return this.client.get(this._rutaBase+'get_destinatarios_transferencia.php', {params:p});
  }

  getRecibosTransferenciasFuncionario(idFuncionario:string):Observable<any>{
    let p = {id_funcionario:idFuncionario};
    return this.client.get(this._rutaBase+'get_recibos_transferencias_funcionario_externo.php', {params:p});
  }
  
  GetReciboTransferenciaXId(idTransferencia:string):Observable<any>{
    let p = {id_transferencia:idTransferencia};
    return this.client.get(this._rutaBase+'get_detalle_transferencia.php', {params:p});
  }

  getRecibosTransferenciasFuncionario2(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_recibos_transferencias_funcionario_externo.php', {params:p});
  }

  verificarEstadoReciboTransferencia(idTransferencia:string){
    let p = {id_transferencia:idTransferencia};
    return this.client.get(this._rutaBase+'verificar_estado_recibo_transferencia.php', {params:p});
  }

  anularReciboTransferencias(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'anular_transferencia_nuevo.php', data);
  }

  public BloquearTransferencia(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'bloquear_transferencia_parcial_consultor.php', data);
  }

  public DesbloquearTransferencia(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'desbloquear_transferencia_parcial_consultor.php', data);
  }
  
  public CheckEstadoAperturaTransferencia(idTransferencia:string):Observable<any>{
    let p = {id_transferencia:idTransferencia};
    return this.client.get(this._rutaBase+'/verificar_estado_apertura_transferencia.php', {params:p});
  }

  public GetTransferenciasConsultorObservable(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_transferencias_consultores_observable.php', {params:p});
  }

  public GetTransferenciasConsultorObservableDev(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_transferencias_consultores_observable_dev.php', {params:p});
  }

  public GetPagosTransferencias(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_pagos_transferencias.php', {params:p});
  }
  
  public DevolverTransferencia(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/devolver_transferencia.php', data);
  }
  
  public GetMaximaHoraTransferencia():Observable<any>{
    return this.client.get(this._rutaBase+'/get_maxima_hora_transferencias.php');
  }

  public AlertarTransferencia(p):Observable<any>{
    return this.client.get(this._rutaBase+'/alertar_transferencia.php',{params:p});
  }

}
