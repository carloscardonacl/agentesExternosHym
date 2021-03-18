import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CupoAgente } from '../services/cupo-agente.service';
import { LoginService } from '../services/login.service';
import { Globales } from '../shared/globales/globales';
//477,012,146
@Component({
  selector: 'app-cupo',
  templateUrl: './cupo.component.html',
  styleUrls: ['./cupo.component.scss'],
})
export class CupoComponent implements OnInit {
  @ViewChild('confirmSwal') confirmSwal: any;
  @ViewChild('ModalPago') ModalPago: any;
  Cargando = false;
  public limit = 5;
  public currentPage = 1;
  public numReg = 0;

  public pagos: any = [];
  public Cupo: any = {
    Cupo: 0,
    Cupo_Usado: 0,
  };
  public Pago: any = {
    Valor: 0,
    Recibo: '',
    Observación: '',
  };
  constructor(
    public _cupo: CupoAgente,
    public _login: LoginService,
    private globales: Globales,
    public http: HttpClient
  ) {
    this.GetRegistroPagos();
    let p = {id_agente_externo : this._login.user().Id_Agente_Externo }
    
    this._cupo.getCupo(p).subscribe(d=>{
        this.Cupo = d
    })
  }

  ngOnInit(): void {}

  async GuardarPago() {
   
    
    if ( await this.validateCupo()) {
      console.log('enter');
      
      let form = new FormData();
      form.append('pago', JSON.stringify(this.Pago));
      form.append('id_agente_externo', this._login.user().Id_Agente_Externo);

      this.http
        .post(
          this.globales.ruta + 'php/agentesexternos/registrar_pago.php',
          form
        )
        .subscribe((d: any) => {
          this.confirmSwal.title = d.title;
          this.confirmSwal.text = d.text;
          this.confirmSwal.type = d.type;
          this.confirmSwal.show();
          this.ModalPago.hide();
          this.GetRegistroPagos();
          this.resetPago();
        });
    }
  }

  GetRegistroPagos() {
    let params = {
      id_agente_externo: this._login.user().Id_Agente_Externo,
      limit: this.limit.toString(),
      currentPage: this.currentPage.toString(),
    };
    this.Cargando = true;
    this.http
      .get(
        this.globales.ruta +
          'php/agentesexternos/get_registro_pagos_agente_externo.php',
        { params }
      )
      .subscribe((d: any) => {
        this.pagos = d.data;
        this.numReg = d.numReg;
        this.Cargando = false;
      });
  }
  resetPago() {
    this.Pago = {
      Valor: 0,
      Recibo: '',
      Observación: '',
    };
  }
  async validateCupo() {
    let p = {id_agente_externo : this._login.user().Id_Agente_Externo }
    await this._cupo
      .getCupo(p)
      .toPromise()
      .then((valor) => {
        this.Cupo = valor;
        
      });
   
      
    if (this.Cupo.Cupo_Usado < this.Pago.Valor) {
      this.confirmSwal.title = 'Error!';
      this.confirmSwal.text = 'No se puede superar el valor de cupo inicial';
      this.confirmSwal.type = 'error';
      this.ModalPago.hide();
      this.confirmSwal.show();
      this.resetPago();
      return false;
    }
    return true
  }
}
