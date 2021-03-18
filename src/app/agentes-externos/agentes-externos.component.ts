import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DestinatarioService } from '../services/destinatario.service';
import { MonedaService } from '../services/moneda.service';
import { Globales } from '../shared/globales/globales';
import { GeneralService } from '../shared/services/general/general.service';
import { Observable, of, Subject } from 'rxjs';
import * as AccionModalRemitente from '../shared/Enums/AccionModalRemitente';
import { debounceTime, distinctUntilChanged, map, switchMap, delay, tap, catchError } from 'rxjs/operators';

import { SwalService } from '../services/swal.service';
import { PermisoService } from '../services/permiso.service';
import { ToastService } from '../services/toast.service';
import { LoginService } from '../services/login.service';
import { NgForm } from '@angular/forms';
import { TransferenciaService } from '../services/transferencia.service';
import { CupoAgente } from '../services/cupo-agente.service';
@Component({
  selector: 'app-agentes-externos',
  templateUrl: './agentes-externos.component.html',
  styleUrls: ['./agentes-externos.component.scss']
})
export class AgentesExternosComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('transferenciaExitosaSwal') transferenciaExitosaSwal: any;
  public funcionario_data: any = this.generalService.SessionDataModel.funcionarioData;
/*   public IdCaja: any = this.generalService.SessionDataModel.idCaja; */
public Remitente_Giro: any = '';
public Destinatario_Giro: any = '';

Transferencia = [];

  Transferencia1 = true;
  Transferencia2 = false;
  public MonedasTransferencia: any = [];
  public Monedas: any = [];
  public InputBolsaBolivares: boolean = false;
  validateInputDocumentSmall: any = [];
  public ControlVisibilidadTransferencia: any = {
    DatosCambio: true,
    Destinatarios: true,
    DatosRemitente: true,
    DatosCredito: false,
    DatosConsignacion: false,
    SelectCliente: false
  };

  public openModalGiro: Subject<any> = new Subject<any>();
  public EditRemitenteTransferencia: boolean = false;
  public CardSelection: any = {
    cajeros: false,
    cambios: true,
    trans: true,
    giros: false,
    traslados: false,
    otrotraslados: false,

    corresponsal: false,
    servicios: false,
    egresos: false,
  }

  public MonedaParaTransferencia: any = {
    id: '',
    nombre: '',
    Valores: {
      Min_Venta_Efectivo: '',
      Max_Venta_Efectivo: '',
      Sugerido_Venta_Efectivo: '',
      Min_Compra_Efectivo: '',
      Max_Compra_Efectivo: '',
      Sugerido_Compra_Efectivo: '',
      Min_Venta_Transferencia: '',
      Max_Venta_Transferencia: '',
      Sugerido_Venta_Transferencia: '',
      Costo_Transferencia: '',
      Comision_Efectivo_Transferencia: '',
      Pagar_Comision_Desde: '',
      Min_No_Cobro_Transferencia: '',
    }
  };
  
  public ActulizarTablaRecibos: Subject<any> = new Subject<any>();
  public GiroModel: any = {

    //REMITENTE
    Departamento_Remitente: '',
    Municipio_Remitente: '',
    Documento_Remitente: '',
    Nombre_Remitente: '',
    Telefono_Remitente: '',

    //DESTINATARIO
    Departamento_Destinatario: '',
    Municipio_Destinatario: '',
    Documento_Destinatario: '',
    Nombre_Destinatario: '',
    Telefono_Destinatario: '',

    //DATOS GIRO
    Valor_Recibido: '',
    Comision: '',
    Valor_Total: '',
    Valor_Entrega: '',
    Detalle: '',
    Giro_Libre: false,
    Identificacion_Funcionario: this.funcionario_data.Id_Agente_Externo,
    Id_Oficina: 0,
    Id_Caja: 0,
    Id_Moneda: ''
  };
  //MODELO PARA TRANSFERENCIAS
  public TransferenciaModel: any = {
    Forma_Pago: 'Efectivo',
    Tipo_Transferencia: 'Transferencia',

    //DATOS DEL CAMBIO
    Moneda_Origen: '',
    Moneda_Destino: '',
    Cantidad_Recibida: '',
    Cantidad_Transferida: '',
    Cantidad_Transferida_Con_Bolivares: '0',
    Tasa_Cambio: '',
    Id_Agente_Externo: this.funcionario_data.Id_Agente_Externo,
    /* Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja, */
    Observacion_Transferencia: '',
   
    //DATOS REMITENTE
    Documento_Origen: '',
    Nombre_Remitente: '',
    Telefono_Remitente: '',

    //DATOS CREDITO
    Cupo_Tercero: 0,
    Bolsa_Bolivares: '0',

    //DATOS CONSIGNACION
    Id_Tercero_Destino: '',
    Id_Cuenta_Bancaria: '',
    Tipo_Origen: 'Remitente',
    Tipo_Destino: 'Destinatario'
  };
  
  public Cupo: any = {
    Cupo: 0,
    Cupo_Usado: 0,
  };
  @ViewChild('confirmSwal') confirmSwal: any;

  public ListaDestinatarios: any = [
    {
      id_destinatario_transferencia: '',
      Numero_Documento_Destino: '',
      Nombre_Destinatario: '',
      Id_Destinatario_Cuenta: '',
      Valor_Transferencia: '',
      copia: '',
      Cuentas: [],
      Id_Moneda: '',
      EditarVisible: false
    }
  ];
  public id_remitente: any = '';
  public tercero_credito: any = '';
  public RemitenteModalEnum = AccionModalRemitente.AccionModalRemitente;
  public DeshabilitarValor: boolean = true;
  public DeshabilitarTasa: boolean = true;
  public TransferenciaPesos: boolean = false;
  public PosicionDestinatarioActivo: any = '';
  public AbrirModalDestinatario: Subject<any> = new Subject<any>();
  public destinatario:any = {}
  public DestinatarioEditar: boolean = false;
  constructor( 
    public _cupo:CupoAgente,
    private http: HttpClient,
    private _monedaService: MonedaService,
    public globales: Globales,
    private destinatarioService: DestinatarioService,
    private generalService: GeneralService,
    private swalService: SwalService,
    private permisoService: PermisoService,
    private _toastService: ToastService,
    private _login:LoginService,
    private _transferenciaService: TransferenciaService
    ) { }

  ngOnInit(): void {
  }
  EliminarDestinatarioTransferencia(index) {
    this.ListaDestinatarios.splice(index, 1);
    this.HabilitarCampoValor();
    // this.TransferenciaModel.Cantidad_Transferida = 0;

  }
  resetModel(){
    this.TransferenciaModel.Telefono_Remitente = '';
    this.TransferenciaModel.Nombre_Remitente = '';
    this.EditRemitenteTransferencia = false;
  }
  AutoCompletarRemitente(modelo: any) {
    console.log(modelo , 'remitente');
    
  
      if (typeof (modelo) == 'object') {
  
        // console.log('Autocompletando- object ', modelo);
        this.TransferenciaModel.Documento_Origen = '';
        this.TransferenciaModel.Documento_Origen = modelo.Id_Transferencia_Remitente;
        this.TransferenciaModel.Telefono_Remitente = modelo.Telefono;
        this.TransferenciaModel.Nombre_Remitente = modelo.Nombre;
        this.EditRemitenteTransferencia = true;
  
      } else if (typeof (modelo) == 'string') {
        console.log('else fi');
        
        //this.TransferenciaModel.Documento_Origen = '';
        this.TransferenciaModel.Telefono_Remitente = '';
        this.TransferenciaModel.Nombre_Remitente = '';
        this.EditRemitenteTransferencia = false;
      }
  
      console.log(this.TransferenciaModel.Documento_Origen ,'tra after');
      console.log(modelo,'modelo after');
    }
  

    validateInputDocumentRetard(id: string, accion: string, posicionDestinatario: string) {
    setTimeout(() => {
      this.validateInputDocument(id, accion, posicionDestinatario)
    }, 200);
  }
  LongitudCarateres(i) {
    return parseInt(i.length);
  }

  
  ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
    console.log(msg,'msg');
    
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }
  Asignar(valor, total_destinatarios, count) {
    let MultiplicadorDeConversion = 0;

    if (this.ListaDestinatarios[0].Valor_Transferencia == '') {
      this.ListaDestinatarios[0].Valor_Transferencia = '0';
    }
    this.Monedas.forEach(element => {

      if (element.Id_Moneda == this.TransferenciaModel.Moneda_Destino) {
        MultiplicadorDeConversion = element.valor_moneda.Sugerido_Compra_Efectivo
      }

    });

    let aTransferir = 0;
    for (let i = this.ListaDestinatarios.length - 1; i >= 0; i--) {
      aTransferir += this.ListaDestinatarios[i]['Valor_Transferencia'];
    }

    if (aTransferir == 0) {
      this.ListaDestinatarios[0].Valor_Transferencia = valor;
      this.ListaDestinatarios[0].copia = valor * MultiplicadorDeConversion;
    }

    if (valor > aTransferir) {
      for (let i = this.ListaDestinatarios.length - 1; i >= 0; i--) {
        this.ListaDestinatarios[i]['Valor_Transferencia'] = 0;
        this.ListaDestinatarios[i].copia = 0;
      }
      this.ListaDestinatarios[0].Valor_Transferencia = valor;
      this.ListaDestinatarios[0].copia = valor * MultiplicadorDeConversion;
    }


    if (valor < aTransferir) {
      let diferencia = aTransferir - valor
      for (let i = this.ListaDestinatarios.length - 1; i >= 0; i--) {

        if (diferencia >= this.ListaDestinatarios[i]['Valor_Transferencia']) {
          diferencia = diferencia - this.ListaDestinatarios[i]['Valor_Transferencia']
          this.ListaDestinatarios[i]['Valor_Transferencia'] = 0;
          this.ListaDestinatarios[i].copia = 0;
        }

        else {
          this.ListaDestinatarios[i]['Valor_Transferencia'] = this.ListaDestinatarios[i]['Valor_Transferencia'] - diferencia;
          this.ListaDestinatarios[i].copia = this.ListaDestinatarios[i]['Valor_Transferencia'] * MultiplicadorDeConversion;
          diferencia = 0
        }

      }
    }

  }

  CargarRemitenteTransferencia(remitente: any) {

    this.id_remitente = remitente.model;
    this.TransferenciaModel.Documento_Origen = remitente.model.Id_Transferencia_Remitente;
    this.TransferenciaModel.Nombre_Remitente = remitente.model.Nombre;
    this.TransferenciaModel.Telefono_Remitente = remitente.model.Telefono;
    this.EditRemitenteTransferencia = true;
  }


  EditarDest2(id: string, accion: string, posicionDestinatario: string) {
  console.log('accion');
  
    if (accion == 'crear especial') {

      // let v = this.ListaDestinatarios[posicionDestinatario].Numero_Documento_Destino;
      let v = this.ListaDestinatarios[posicionDestinatario].Numero_Documento_Destino;
      // console.log(['Datas v ', v, this.ListaDestinatarios[posicionDestinatario]['Id_Destinatario']]);
      if (v == '') {
        return;
      }

      let p = { id_destinatario: v };
      this.destinatarioService.validarExistenciaDestinatario(p).subscribe((data) => {
        if (data == 0) {
          var longitud = this.LongitudCarateres(v);
          if (longitud > 6) {
            this.PosicionDestinatarioActivo = posicionDestinatario;
            let objModal = { id_destinatario: id, accion: accion };
            this.AbrirModalDestinatario.next(objModal);

          } else if (longitud < 6) {
          }
        }
      });
    } else if (accion == 'editar cuentas') {

      this.PosicionDestinatarioActivo = posicionDestinatario;
      let objModal = { id_destinatario: id, accion: accion };
      this.AbrirModalDestinatario.next(objModal);
    }
  }


  AsignarDatosDestinatario(respuestaModal: any): void {
  console.log('res',respuestaModal);
  
    if (respuestaModal.willdo == 'limpiar campo id dest') {
      this.ListaDestinatarios[this.PosicionDestinatarioActivo].id_destinatario_transferencia = '';
    }


    else if (respuestaModal.willdo == 'actualizar') {

      setTimeout(() => {
        this.http.get(this.globales.ruta + 'php/destinatario_externo/filtrar_destinatario_por_id.php', { params: { id_destinatario: respuestaModal.id_destinatario, moneda: this.MonedaParaTransferencia.id,  id_agente_externo:this._login.user().Id_Agente_Externo } }).subscribe((data: any) => {
          if (data != '') {
              console.log('pos active',this.PosicionDestinatarioActivo);
              
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].Nombre_Destinatario = data.Nombre;
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].Numero_Documento_Destino = data.Id_Destinatario;
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].id_destinatario_transferencia = data.Id_Destinatario;
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Destinatario_Cuenta = data['Cuentas'][0].Id_Destinatario_Cuenta;

            this.ListaDestinatarios[this.PosicionDestinatarioActivo].Cuentas = data['Cuentas'];
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Moneda = this.MonedaParaTransferencia.id;
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].EditarVisible = true;
            this.PosicionDestinatarioActivo = '';
          } else {

            this.ShowSwal('error', 'Consulta Fallida', 'No se encontraron datos del destinatario que se insertó!');
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].id_destinatario_transferencia = '';
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].Numero_Documento_Destino = '';
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].Nombre_Destinatario = '';
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Destinatario_Cuenta = '';
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].Cuentas = [];
            this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Moneda = this.MonedaParaTransferencia.id;

            this.PosicionDestinatarioActivo = '';
          }
        });
      }, 100);
    }
  }



  AsignarDatosDestinatarioNuevo(id): boolean {
    this.http.get(this.globales.ruta + 'php/destinatarios/filtrar_destinatarios.php', { params: { id_destinatario: id, moneda: this.MonedaParaTransferencia.id } }).subscribe((data: any) => {

      if (data != '') {

        if (this.DestinatarioEditar) {

          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Cuentas = data.Cuentas;

        } else {

          this.ListaDestinatarios[this.PosicionDestinatarioActivo].id_destinatario_transferencia = data;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Numero_Documento_Destino = data.Id_Destinatario;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Nombre_Destinatario = data.DestinatarioModel.Nombre;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Destinatario_Cuenta = '';
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Cuentas = data.Cuentas;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Moneda = this.MonedaParaTransferencia.id;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].EditarVisible = false;
        }

        this.DestinatarioEditar = false;
        this.PosicionDestinatarioActivo = '';
        return true;
      } else {

        this.ShowSwal('error', 'Consulta Fallida', 'No se encontraron datos del destinatario que se insertó!');
        this.DestinatarioEditar = false;
        this.PosicionDestinatarioActivo = '';
        return false;
      }
    });

    return true;
  }
  AutoCompletarDestinatario(modelo, i, listaDestinatarios, dest) {
    if (typeof (modelo) == 'object') {
      if (modelo.Cuentas != undefined) {
        listaDestinatarios[i].Numero_Documento_Destino = modelo.Id_Destinatario;
        listaDestinatarios[i].Nombre_Destinatario = modelo.Nombre;
        listaDestinatarios[i].Cuentas = modelo.Cuentas;
        listaDestinatarios[i].esconder = true;
        listaDestinatarios[i].EditarVisible = true;
        dest['Id_Destinatario_Cuenta'] = modelo.Cuentas[0].Id_Destinatario_Cuenta
      } else {
        listaDestinatarios[i].esconder = false;
      }
    } else if (typeof (modelo) == 'string') {
      if (modelo == '') {
        listaDestinatarios[i].Numero_Documento_Destino = '';
      } else {

        listaDestinatarios[i].Numero_Documento_Destino = modelo;
      }

      listaDestinatarios[i].Id_Destinatario_Cuenta = '';
      listaDestinatarios[i].Nombre_Destinatario = '';
      listaDestinatarios[i].Valor_Transferencia = '';
      listaDestinatarios[i].EditarVisible = false;
      listaDestinatarios[i].Cuentas = [];

    }
  }
  /* formatterClienteCambioCompra = (x: { Nombre: string }) => x.Nombre;
  search_destino2 = (text$: Observable<string>) => text$.pipe(debounceTime(200),
   distinctUntilChanged(), switchMap( 
     term =>  this.http.get(this.globales.ruta + 'php/destinatarios/filtrar_destinatario_por_id.php',
    { params: { id_destinatario: term, moneda: this.MonedaParaTransferencia.id } })
   .pipe(  map((response, params) => console.log(response)
   )
        )
    )
  
  ); */



  search(term: string) {
    console.log(term);
    
    if (term === '') {
      this.resetModel();
      return of([]);
    }

    return this.http.get(this.globales.ruta + 'php/destinatario_externo/filtrar_destinatario_por_id.php',
    { params: { id_destinatario: term, moneda: this.MonedaParaTransferencia.id, id_agente_externo:this._login.user().Id_Agente_Externo } }).pipe(
        map(response => response )
      );
  }
  formatterClienteCambioCompra = (x: { Nombre: string }) => x.Nombre;
  search_destino2 = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => console.log('sercing')
    ),
    switchMap(term =>
      this.search(term).pipe(
        tap((d) => console.log('tap')),
        catchError(() => {
          console.log('sercierrorrng');
          return of([]);
        }))
    ),
    tap(() => console.log('tap2'))
  )

  buscarDestinatario(id, i, listaDestinatarios, dest,term)
{
  this.http.get(this.globales.ruta + 'php/destinatario_externo/filtrar_destinatario_por_id.php',
    { params: { id_destinatario: term, moneda: this.MonedaParaTransferencia.id, /* id_agente_externo:this._login.user().Id_Agente_Externo */ } }).subscribe((modelo:any)=>{
      

      if (modelo.hasOwnProperty('Id_Destinatario')) {
        if (modelo.Cuentas != undefined) {
          listaDestinatarios[i].Numero_Documento_Destino = modelo.Id_Destinatario;
          listaDestinatarios[i].Nombre_Destinatario = modelo.Nombre;
          listaDestinatarios[i].Cuentas = modelo.Cuentas;
          listaDestinatarios[i].esconder = true;
          listaDestinatarios[i].EditarVisible = true;
          dest['Id_Destinatario_Cuenta'] = modelo.Cuentas[0].Id_Destinatario_Cuenta
        } else {
          listaDestinatarios[i].esconder = false;
        }
      } else  {
        if (id == '') {
          listaDestinatarios[i].Numero_Documento_Destino = '';
        } else {
  
          listaDestinatarios[i].Numero_Documento_Destino = id;
        }
  
        listaDestinatarios[i].Id_Destinatario_Cuenta = '';
        listaDestinatarios[i].Nombre_Destinatario = '';
        listaDestinatarios[i].Valor_Transferencia = '';
        listaDestinatarios[i].EditarVisible = false;
        listaDestinatarios[i].Cuentas = [];
        var longitud = this.LongitudCarateres(this.ListaDestinatarios[i].Numero_Documento_Destino);
        console.log(this.ListaDestinatarios[i]);
        
        if (longitud > 6) {
          this.PosicionDestinatarioActivo = i;
          let objModal = { id_destinatario: this.ListaDestinatarios[i].Numero_Documento_Destino, accion: 'crear especial' };
          this.AbrirModalDestinatario.next(objModal);

        } else if (longitud <= 6) {
          this.swalService.ShowMessage(['warning','Error', 'El numero de caracteres debe ser mayor a 6 !']);
        }
      }



     /*  if ( d.hasOwnProperty('Id_Transferencia_Remitente') ) {
        console.log('si', typeof(d));
        
        this.TransferenciaModel.Documento_Origen = '';
        this.TransferenciaModel.Documento_Origen = d.Id_Transferencia_Remitente;
        this.TransferenciaModel.Telefono_Remitente = d.Telefono;
        this.TransferenciaModel.Nombre_Remitente = d.Nombre;
        this.EditRemitenteTransferencia = true;

       
      }else{
        console.log('no');
        
        this.TransferenciaModel.Telefono_Remitente = '';
        this.TransferenciaModel.Nombre_Remitente = '';
        this.EditRemitenteTransferencia = false;
      } */
    })
} 


  //REMITENTE!!!

  search_remitente2 = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => console.log('sercing')
    ),
    switchMap(term =>
      this.http.get(this.globales.ruta + 'php/remitente_externo/filtrar_remitente_por_id.php', { params: { id_remitente: term } }).pipe(
        tap(() => console.log('tap')),
        catchError(() => {
          console.log('sercierrorrng');
          return of([]);
        }))
    ),
    tap(() => console.log('tap2'))
  )

  buscarRemitente(term)
{
  this.http.get(this.globales.ruta + 'php/remitente_externo/filtrar_remitente_por_id.php',
    { params: { id_remitente: term,/*  moneda: this.MonedaParaTransferencia.id, id_agente_externo:this._login.user().Id_Agente_Externo  */} }).subscribe((d:any)=>{
      
      if ( d.hasOwnProperty('Id_Transferencia_Remitente') ) {
        console.log('si', typeof(d));
        
        this.TransferenciaModel.Documento_Origen = '';
        this.TransferenciaModel.Documento_Origen = d.Id_Transferencia_Remitente;
        this.TransferenciaModel.Telefono_Remitente = d.Telefono;
        this.TransferenciaModel.Nombre_Remitente = d.Nombre;
        this.EditRemitenteTransferencia = true;

       
      }else{
        console.log('no');
        
        this.TransferenciaModel.Telefono_Remitente = '';
        this.TransferenciaModel.Nombre_Remitente = '';
        this.EditRemitenteTransferencia = false;
      }
    })
} 


GuardarTransferencia(formulario: NgForm) {
  let forma_pago = this.TransferenciaModel.Forma_Pago;
  this.GuardarTransferenciaEfectivo();
}
  // ************************************************** GuardarTransferenciaEfectivo **********************************************************************************

 async GuardarTransferenciaEfectivo() {


    let tipo_transferencia = this.TransferenciaModel.Tipo_Transferencia;
    let total_a_transferir = isNaN((parseFloat(this.TransferenciaModel.Cantidad_Transferida))) ? 0 : (parseFloat(this.TransferenciaModel.Cantidad_Transferida));
    let total_suma_transferir_destinatarios = this.GetTotalTransferenciaDestinatarios();
    this.TransferenciaModel.Id_Agente_Externo = this.funcionario_data.Id_Agente_Externo;

    // console.log(this.TransferenciaModel);


    if ( !this.ValidateBeforeSubmit() ) {
      return;
    }
    if( !(await this.validateCupo()) ){
      return
  }
  467999901
    console.log(tipo_transferencia,'tipoo transfer');
    switch (tipo_transferencia) {
      
      case 'Transferencia':
        if (this.TransferenciaModel.Bolsa_Bolivares != '0') {

          if (total_suma_transferir_destinatarios > 0) {
            let restante_bolsa = (((parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir) - total_suma_transferir_destinatarios)).toString();
            if (total_suma_transferir_destinatarios < (parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir)) {
              this.TransferenciaModel.Cantidad_Transferida_Con_Bolivares = total_suma_transferir_destinatarios;
            } else if (total_suma_transferir_destinatarios >= (parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir)) {
              this.TransferenciaModel.Cantidad_Transferida_Con_Bolivares = parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir;
            }
            this.SaveTransferencia(restante_bolsa);
          } else {
            this.ShowSwal('warning', 'Alerta', 'No se han cargado valores para transferir, ya sea en los destinatarios o en los datos de la transferencia!');
          }

        } else {

          // console.log(['Siguiente if  de ...']);
          if (total_suma_transferir_destinatarios > 0 && total_a_transferir == total_suma_transferir_destinatarios) {

            this.SaveTransferencia();
          } else {
            this.ShowSwal('warning', 'Alerta', 'El total repartido entre los destinatarios es mayor al total a entegar');
          }
        }
    
      default:
        break;
    }
  }

  async validateCupo() {
    let p = {id_agente_externo : this._login.user().Id_Agente_Externo }
    await this._cupo
      .getCupo(p)
      .toPromise()
      .then((valor) => {
        this.Cupo = valor;
        
      });
   
      console.log(this.Cupo , 'cupo');
      
    
    if ( (this.Cupo.Cupo - this.Cupo.Cupo_Usado) < this.TransferenciaModel.Cantidad_Recibida) {
      this.confirmSwal.title = 'Error!';
      this.confirmSwal.text = 'No se puede superar el valor de cupo inicial';
      this.confirmSwal.type = 'error';
      this.confirmSwal.show();
      
      return false;
    }
    return true
  }

  // ************************************************** Termina aqui **********************************************************************************
  SaveTransferencia(bolsa = '') {
    this.TransferenciaModel.Id_Tercero_Destino = '0';
    console.log('here');
    
    let info = this.generalService.normalize(JSON.stringify(this.TransferenciaModel));
    let destinatarios = this.generalService.normalize(JSON.stringify(this.ListaDestinatarios));
    //return;

    let datos = new FormData();
    datos.append("datos", info);
    datos.append("destinatarios", destinatarios);
    datos.append('id_oficina', '0');

    if (bolsa != '') {
      datos.append("bolsa_restante", bolsa);
    }
    this.http.post(this.globales.ruta + 'php/pos/guardar_transferencia_externo.php', datos)
     .subscribe((data: any) => {
        this.LimpiarBancosDestinatarios(this.ListaDestinatarios);
        this.LimpiarModeloTransferencia();
        this.SetTransferenciaDefault();
        this.transferenciaExitosaSwal.show();
        this.Transferencia1 = true;
        this.Transferencia2 = false;
        this.CargarTransferenciasDiarias();
        this.TransferenciaModel.Moneda_Destino = this._getIdMoneda('bolivares soberanos');
        this._getMonedasExtranjeras();
      });
  }
  private _getIdMoneda(nombreMoneda: string) {
    let moneda = this.Monedas.find(x => x.Nombre.toLowerCase() == nombreMoneda.toLowerCase());
    if (!this.generalService.IsObjEmpty(moneda)) {
      return moneda.Id_Moneda;
    } else {
      return '1';
    }
  }
  private _getMonedasExtranjeras() {
    this.MonedasTransferencia = [];
    this._monedaService.getMonedasExtranjeras().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.MonedasTransferencia = data.query_data;
      } else {
        this.MonedasTransferencia = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  
  CargarTransferenciasDiarias() {
    this.Transferencia = [];
    this._transferenciaService.getRecibosTransferenciasFuncionario(this.funcionario_data.Id_Agente_Externo).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Transferencia = data.query_data;
      } else {

        this.Transferencia = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }

    });
    this.Transferencia = [];
    this.http.get(this.globales.ruta + 'php/pos/lista_recibos_transferencia_externo.php', { params: { funcionario: this.funcionario_data.Id_Agente_Externo } }).subscribe((data: any) => {
      this.Transferencia = data;
    });

    this.ActulizarTablaRecibos.next();
  }



  SetTransferenciaDefault() {
    this.ControlVisibilidadTransferencia.DatosCambio = true;
    this.ControlVisibilidadTransferencia.Destinatarios = true;
    this.ControlVisibilidadTransferencia.DatosRemitente = true;
    this.ControlVisibilidadTransferencia.DatosCredito = false;
    this.ControlVisibilidadTransferencia.DatosConsignacion = false;
    this.ControlVisibilidadTransferencia.SelectCliente = false;
  }

  ValidateBeforeSubmit() {

    let Forma_Pago = this.TransferenciaModel.Forma_Pago;
    let tipo = this.TransferenciaModel.Tipo_Transferencia;

    if (Forma_Pago == 'Efectivo' && tipo == 'Transferencia') {
      //VALIDAR DESTINATARIOS
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE

      let qty_destinatarios = this.ListaDestinatarios.length;
      for (let index = 0; index < (qty_destinatarios); index++) {
        let d = this.ListaDestinatarios[index];
        if (d.Numero_Documento_Destino == '' || d.Numero_Documento_Destino == undefined) {

          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignado su nro. de documento!');
          return false;
        }

        if (d.Id_Destinatario_Cuenta == '' || d.Id_Destinatario_Cuenta == undefined) {

          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada un nro. de cuenta para la transacción!');
          return false;
        }

        if (d.Valor_Transferencia == '' || d.Valor_Transferencia == 0 || d.Valor_Transferencia == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada el valor a transferir o es 0, por favor revise!');
          return false;
        }
      }

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) {
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }

      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;

    } else if (Forma_Pago == 'Efectivo' &&  ( tipo == 'Cliente' || tipo == 'Proveedor' )) {
      //VALIDAR DESTINATARIO
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado un destinatario para la transferencia!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) {
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;

    } else if (Forma_Pago == 'Credito' && tipo == 'Transferencia') {
      //VALIDAR TERCERO CREDITO
      //VALIDAR DESTINATARIOS
      //VALIDAR DATOS DEL CAMBIO

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'Debe agregar un tercero antes de guardar una transferencia');
        return false;
      }

      let qty_destinatarios = this.ListaDestinatarios.length;
      this.ListaDestinatarios.forEach(d => {
        if (d.Numero_Documento_Destino == '' || d.Numero_Documento_Destino == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignado su nro. de documento!');
          return false;
        }

        if (d.Id_Destinatario_Cuenta == '' || d.Id_Destinatario_Cuenta == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada un nro. de cuenta para la transacción!');
          return false;
        }

        if (d.Valor_Transferencia == '' || d.Valor_Transferencia == 0 || d.Valor_Transferencia == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada el valor a transferir o es 0, por favor revise!');
          return false;
        }
      });

      if ((this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) && this.TransferenciaModel.Bolsa_Bolivares == '0') {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if ((this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) && this.TransferenciaModel.Bolsa_Bolivares == '0') {
        this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
        return false;
      }

      if ((this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) && this.TransferenciaModel.Bolsa_Bolivares == '0') {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      return true;

    } else if (Forma_Pago == 'Credito' && (tipo == 'Cliente' ||tipo == 'Proveedor' )) {
      //AQUI NO SE HACEN VALIDACIONES YA QUE NO PUEDE HABER UNA TRANSFERENCIA CREDITO EN ESTE FORMATO
      this.ShowSwal('warning', 'Alerta', 'La forma de pago credito no permite tipos de pago a clientes!');
      return false;

    } else if (Forma_Pago == 'Consignacion' && tipo == 'Transferencia') {
      //VALIDAR CONSIGNACION
      //VALIDAR DESTINATARIOS
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE

      if (this.TransferenciaModel.Id_Cuenta_Bancaria == '' || this.TransferenciaModel.Id_Cuenta_Bancaria == 0 || this.TransferenciaModel.Id_Cuenta_Bancaria == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado la cuenta para la consignacion!');
        return false;
      }

      this.ListaDestinatarios.forEach(d => {
        if (d.Numero_Documento_Destino == '' || d.Numero_Documento_Destino == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignado su nro. de documento!');
          return false;
        }

        if (d.Id_Destinatario_Cuenta == '' || d.Id_Destinatario_Cuenta == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada un nro. de cuenta para la transacción!');
          return false;
        }

        if (d.Valor_Transferencia == '' || d.Valor_Transferencia == 0 || d.Valor_Transferencia == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada el valor a transferir o es 0, por favor revise!');
          return false;
        }
      });

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) {
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;

    } else if (Forma_Pago == 'Consignacion' && (tipo == 'Cliente' || tipo == 'Proveedor' )) {
      //VALIDAR DESTINATARIO
      //VALIDAR CONSIGNACION
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE this.swalService.ShowMessage(['warning', data.titulo, 'El numero de caracteres debe ser mayor a 6 !']);

      if (this.TransferenciaModel.Id_Tercero_Destino == '' || this.TransferenciaModel.Id_Tercero_Destino == 0 || this.TransferenciaModel.Id_Tercero_Destino == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado un destinatario para la consignacion!');
        return false;
      }

      if (this.TransferenciaModel.Id_Cuenta_Bancaria == '' || this.TransferenciaModel.Id_Cuenta_Bancaria == 0 || this.TransferenciaModel.Id_Cuenta_Bancaria == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado la cuenta para la consignacion!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) {
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;
    }
  }

  LimpiarModeloTransferencia(dejarFormaPago: boolean = false, dejarTipoTransferencia: boolean = false) {
    //MODELO PARA TRANSFERENCIAS
    this.TransferenciaModel = {
      Forma_Pago: dejarFormaPago ? this.TransferenciaModel.Forma_Pago : 'Efectivo',
      Tipo_Transferencia: dejarTipoTransferencia ? this.TransferenciaModel.Tipo_Transferencia : 'Transferencia',

      //DATOS DEL CAMBIO
      Moneda_Origen: '2',
      Moneda_Destino: '',
      Cantidad_Recibida: '',
      Cantidad_Transferida: '',
      Cantidad_Transferida_Con_Bolivares: '0',
      Tasa_Cambio: '',
      Id_Agente_Externo: this.funcionario_data.Id_Agente_Externo,
      Id_Caja: '0',
      Observacion_Transferencia: '',

      //DATOS REMITENTE
      Documento_Origen: '',
      Nombre_Remitente: '',
      Telefono_Remitente: '',

      //DATOS CREDITO
      Cupo_Tercero: 0,
      Bolsa_Bolivares: '0',

      //DATOS CONSIGNACION
      Id_Cuenta_Bancaria: '',
      Tipo_Origen: 'Remitente',
      Tipo_Destino: 'Destinatario'
    };
    // *****************
    this.ListaDestinatarios = [
      {
        id_destinatario_transferencia: '',
        Numero_Documento_Destino: '',
        Nombre_Destinatario: '',
        Id_Destinatario_Cuenta: '',
        Valor_Transferencia: '',
        Cuentas: [],
        EditarVisible: false
      }
    ];

    this.id_remitente = '';
    this.tercero_credito = '';
  }
  LimpiarBancosDestinatarios(listaLimpiar) {
    listaLimpiar.forEach(e => {
      e.Cuentas = [];
      e.id_destinatario_transferencia = '';
    });
  }

  formatter_remitente_custom = (x: { Id_Transferencia_Remitente: string }) => x;
  ValidarValorTransferirDestinatario2(valor, index) {
    if (valor == '') {
      this.ListaDestinatarios[index].Valor_Transferencia = '';

    } else if (this.TransferenciaModel.Forma_Pago == 'Credito') {
      if (this.TransferenciaModel.Bolsa_Bolivares != '0') {
        this._asignarValoresConBolsaBolivares(valor, index);
      } else {
        this._asignarValoresSinBolsaBolivares(valor, index);
      }
    } else {
      this._asignarValoresSinBolsaBolivares(valor, index);
    }
  }
  private _asignarValoresSinBolsaBolivares(valor, i) {


    let MultiplicadorDeConversion = 0;

    this.Monedas.forEach(element => {

      if (element.Id_Moneda == this.TransferenciaModel.Moneda_Destino) {
        MultiplicadorDeConversion = element.valor_moneda.Sugerido_Compra_Efectivo
      }

    });

    if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == '0' || this.TransferenciaModel.Cantidad_Transferida == undefined) {

      this.ListaDestinatarios[i].Valor_Transferencia = '';
      this.ShowSwal('warning', 'Alerta', 'Debe colocar primero el valor a transferir! ');
      return;
    }

    if (valor == '') {
      this.ListaDestinatarios[i].Valor_Transferencia = '0';
      return;
    }



    let total_transferir = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
    valor = parseFloat(valor.replace(/\./g, ''));

    let total_valor_destinatarios = this.GetTotalTransferenciaDestinatarios();

    let total_destinatarios_real = total_valor_destinatarios - valor;
    let conteo = this.ListaDestinatarios.length - 1;

    if (valor > total_transferir) {
      this.ListaDestinatarios[i].Valor_Transferencia = '0';
      this.ListaDestinatarios[i].Valor_Transferencia = total_transferir - total_destinatarios_real;
      this.ListaDestinatarios[i].copia = this.ListaDestinatarios[i].Valor_Transferencia * MultiplicadorDeConversion;

      let toastObj = { textos: ["Alerta", "El valor que coloco supera el total a transferir! "], tipo: "warning", duracion: 4000 };
      this._toastService.ShowToast(toastObj);


    } else if (total_valor_destinatarios > total_transferir) {

      this.ListaDestinatarios[i].Valor_Transferencia = '0';
      this.ListaDestinatarios[i].Valor_Transferencia = (total_valor_destinatarios - valor) - total_transferir;
      if (this.ListaDestinatarios[i].Valor_Transferencia < 0) {
        this.ListaDestinatarios[i].copia = this.ListaDestinatarios[i].Valor_Transferencia * -1 * MultiplicadorDeConversion;
      } else {
        this.ListaDestinatarios[i].copia = this.ListaDestinatarios[i].Valor_Transferencia * MultiplicadorDeConversion;
      }

      let toastObj = { textos: ["Alerta", "El valor que coloco supera el total a transferir! "], tipo: "warning", duracion: 4000 };
      this._toastService.ShowToast(toastObj);

    } else if (total_valor_destinatarios <= total_transferir) {

      let asignar = (valor);

      let asignar_siguiente = (total_transferir - total_valor_destinatarios);
      this.ListaDestinatarios[i].Valor_Transferencia = asignar;
      this.ListaDestinatarios[i].copia = this.ListaDestinatarios[i].Valor_Transferencia * MultiplicadorDeConversion;

      // if (i < conteo) {
      //   this.ListaDestinatarios[(i + 1)].Valor_Transferencia = parseFloat(this.ListaDestinatarios[(i + 1)].Valor_Transferencia) > 0 ? this.ListaDestinatarios[(i + 1)].Valor_Transferencia : asignar_siguiente;
      //   console.log(this.ListaDestinatarios[(i + 1)].Valor_Transferencia, 'sx');
      //   // this.ListaDestinatarios[(i + 1)].copia = this.ListaDestinatarios[(i + 1)].Valor_Transferencia * MultiplicadorDeConversion;
      // }
      this.VerificarDestinatariosConTransferenciaMayorAlTotal();
    }





    if ((valor > total_transferir) || (total_valor_destinatarios > total_transferir)) {
      this.ListaDestinatarios[i].Valor_Transferencia = valor - (total_valor_destinatarios - total_transferir);
      this.ShowSwal('warning', 'Alerta', 'El valor que coloco supera el total a transferir ');
    } else if (total_valor_destinatarios <= total_transferir) {
      let asignar_siguiente = total_transferir - total_valor_destinatarios;
      this.ListaDestinatarios[i].Valor_Transferencia = valor;
      this.ListaDestinatarios[i].copia = this.ListaDestinatarios[i].Valor_Transferencia * MultiplicadorDeConversion;

      if (i < conteo) {
        if (parseFloat(this.ListaDestinatarios[(i + 1)].Valor_Transferencia) > 0) {
          this.ListaDestinatarios[(i + 1)].Valor_Transferencia = this.ListaDestinatarios[(i + 1)].Valor_Transferencia
        } else {
          this.ListaDestinatarios[(i + 1)].Valor_Transferencia = asignar_siguiente
        }
        this.ListaDestinatarios[(i + 1)].copia = this.ListaDestinatarios[(i + 1)].Valor_Transferencia * MultiplicadorDeConversion
      }

      this.VerificarDestinatariosConTransferenciaMayorAlTotal();
    }
    /********************************************************************************************************************************************* */


  }
  VerificarDestinatariosConTransferenciaMayorAlTotal() {
    let total = 0;
    let total_transferido = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
    let index_colocar_cero_ramificado = 0;

    this.ListaDestinatarios.forEach((d: any, i: number) => {
      if (index_colocar_cero_ramificado == 0) {
        total += parseFloat(d.Valor_Transferencia);

        if (total > total_transferido) {
          index_colocar_cero_ramificado = i;
          let restante = total - total_transferido;
          this.ListaDestinatarios[i].Valor_Transferencia = restante;
        }
      } else {

        this.ListaDestinatarios[i].Valor_Transferencia = '';
      }
    });
  }
  private _asignarValoresConBolsaBolivares(valor, i) {
    let bolsa_bolivares = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
    let transferir = (this.TransferenciaModel.Cantidad_Transferida == '' || isNaN(this.TransferenciaModel.Cantidad_Transferida)) ? 0 : parseFloat(this.TransferenciaModel.Cantidad_Transferida);
    let total_valor_destinatarios = this.GetTotalTransferenciaDestinatarios();
    let transferir_con_bolsa = bolsa_bolivares + transferir;
    valor = parseFloat(valor.replace(/\./g, ''));

    if (total_valor_destinatarios > transferir_con_bolsa) {

      let asignar = (valor - (total_valor_destinatarios - transferir_con_bolsa));
      this.ListaDestinatarios[i].Valor_Transferencia = asignar;

    } else if (total_valor_destinatarios < transferir_con_bolsa) {
      this.ListaDestinatarios[i].Valor_Transferencia = valor;
    }
  }

  EditarRemitenteTransferencia(idRemitente: any, accion: string) {
    console.log(idRemitente,accion);
    
    let data = {};
    console.log('id remitente',idRemitente);
    console.log('accion',accion);
    
    //if (typeof (this.id_remitente) == 'string') {
    if (typeof (idRemitente) == 'string') {
      if(idRemitente.length <7){
        this.ShowSwal('warning', 'alerta', 'El número de caracteres debe ser mayor a 6 !!');
        return 
      }
      console.log('1');
      data = { id_remitente: idRemitente, tipo: "Transferencia", accion: accion };
    //} else if (typeof (this.id_remitente) == 'object') {
    } else if (typeof (idRemitente) == 'object') {
      console.log('2');
      data = { id_remitente: idRemitente.Id_Transferencia_Remitente, tipo: "Transferencia", accion: accion };
    }
    console.log('data',data);
    console.log('2 id',idRemitente);
    console.log('model',this.TransferenciaModel.Documento_Origen);
    this.openModalGiro.next(data);
  }

  CargarDatos(data: any) {
    // console.log('Cargar datos ', data);
    if (data.tipo == 'remitente') {

      this.Remitente_Giro = data.model;
      this.GiroModel.Documento_Remitente = data.model.Id_Transferencia_Remitente;
      this.GiroModel.Nombre_Remitente = data.model.Nombre;
      this.GiroModel.Telefono_Remitente = data.model.Telefono;

    } else {

      this.Destinatario_Giro = data.model;
      this.GiroModel.Documento_Destinatario = data.model.Id_Transferencia_Remitente;
      this.GiroModel.Nombre_Destinatario = data.model.Nombre;
      this.GiroModel.Telefono_Destinatario = data.model.Telefono;
    }
  }

  AgregarDestinatarioTransferencia() {

    // if (this.TransferenciaModel.Cantidad_Recibida > 0) {

    let listaDestinatarios = this.ListaDestinatarios;
    for (let index = 0; index < listaDestinatarios.length; index++) {

      if (listaDestinatarios[index].Numero_Documento_Destino == 0 || listaDestinatarios[index].Numero_Documento_Destino == '' || listaDestinatarios[index].Numero_Documento_Destino === undefined) {
        this.ShowSwal('warning', 'Alerta', 'Debe anexar toda la información del(de los) destinatario(s) antes de agregar uno nuevo');
        return;
      }

      // TODO mejorar esta validacion

      // if (listaDestinatarios[index].Id_Destinatario_Cuenta == '' || listaDestinatarios[index].Id_Destinatario_Cuenta === undefined) {
      //   this.ShowSwal('warning', 'Alerta', 'Debe anexar la información del(de los) destinatario(s) antes de agregar uno nuevo');
      //   return;
      // }

      // if(listaDestinatarios[index].Valor_Transferencia == '' || listaDestinatarios[index].Valor_Transferencia === undefined){
      //   this.ShowSwal('warning', 'Alerta', 'Debe anexar la información del(de los) destinatario(s) antes de agregar uno nuevo');
      //   return;
      // }
    }

    let nuevoDestinatario = {
      id_destinatario_transferencia: '',
      Numero_Documento_Destino: '',
      Nombre_Destinatario: '',
      Id_Destinatario_Cuenta: '',
      Valor_Transferencia: '',
      Cuentas: [],
      EditarVisible: false,
      Id_Moneda: this.MonedaParaTransferencia.id
    };

    this.ListaDestinatarios.push(nuevoDestinatario);
    this.HabilitarCampoValor();
    // }else{
    //   this.ShowSwal('warning','Alerta','Debe colocar la cantidad a transferir antes de agregar destinatarios!');
    // }
  }
  HabilitarCampoValor() {
    // this.TransferenciaModel.Cantidad_Transferida = 0;
    if (this.ListaDestinatarios.length > 1) {
      this.DeshabilitarValor = false;
    } else {
      this.DeshabilitarValor = true;
    }
  }
  async validateInputDocument(id: string, accion: string, posicionDestinatario: string) {
    console.log('validate', id, accion , posicionDestinatario);
    
    const p = { id_destinatario: this.ListaDestinatarios[posicionDestinatario].Numero_Documento_Destino };
    console.log(p);
  
    if (p.id_destinatario != "") {
      await this.destinatarioService.validarExistenciaDestinatario(p).toPromise().then((data: any) => {
        if (data == 0) {
          var longitud = this.LongitudCarateres(this.ListaDestinatarios[posicionDestinatario].Numero_Documento_Destino);
          if (longitud > 6) {
            this.PosicionDestinatarioActivo = posicionDestinatario;
            let objModal = { id_destinatario: this.ListaDestinatarios[posicionDestinatario].Numero_Documento_Destino, accion: accion };
            this.AbrirModalDestinatario.next(objModal);

          } else if (longitud <= 6) {
            this.swalService.ShowMessage(['warning', data.titulo, 'El numero de caracteres debe ser mayor a 6 !']);
          }
        }
        if (data == 1) {
          this.validateInputDocumentSmall[posicionDestinatario] = false
        }
      });
    };
  }

   muestra_tabla(id) {
    var tot = document.getElementsByClassName('modulos').length;
      /*     for (let i = 0; i < tot; i++) {
      var id2 = document.getElementsByClassName('modulos').item(i).getAttribute("id");
      document.getElementById(id2).style.display = 'none';
      this.Corresponsal = false;

      this.volverCambioEfectivo();
      this.volverReciboTransferencia();
      this.volverReciboGiro();
      this.volverTraslado();
      this.volverServicio();
      this.volverCorresponsal();
      this.volverReciboServicio();
    } */

    document.getElementById(id).style.display = 'block';
   /*  this.CargarDatosModulo(id); */
  }
  volverReciboTransferencia() {
    this.Transferencia1 = true;
    this.Transferencia2 = false;
    this.LimpiarModeloTransferencia();
  }
  CambiarVista(tipo) {
      
      this.Transferencia1 = false;
      this.Transferencia2 = true;
      this.SetMonedaTransferencia(1);

    }

    private _getMonedas() {
      this.MonedasTransferencia = [];
      this._monedaService.getMonedas().subscribe((data: any) => {
        if (data != null) {
          this.MonedasTransferencia = data;
          this.Monedas = data;
        } else {
          this.MonedasTransferencia = [];
  
        }
      });
    }

    SetMonedaDestinatarios(idMoneda) {
      this.ListaDestinatarios.forEach(d => {
        d.Id_Moneda = idMoneda;
      });
    }

    SetMonedaTransferencia(value) {


      this._getMonedas();
      this.MonedaParaTransferencia.id = value;
      this.TransferenciaModel.Moneda_Destino = value;
      this.SetMonedaDestinatarios(value);
  
  
      if (value != '') {
        this._actualizarCuentasDestinatarios();
  
        let c = {
          Nombre: ''
        }
  
        c.Nombre = this.Monedas.find(x => x.Id_Moneda == value);
  
        this.MonedaParaTransferencia.nombre = c.Nombre;
  
        if (c.Nombre == 'Pesos') {
          this.TransferenciaPesos = true;
          this.MonedaParaTransferencia = {
            id: value,
            nombre: c.Nombre,
            Valores: {
              Min_Venta_Efectivo: '',
              Max_Venta_Efectivo: '',
              Sugerido_Venta_Efectivo: '',
              Min_Compra_Efectivo: '',
              Max_Compra_Efectivo: '',
              Sugerido_Compra_Efectivo: '',
              Min_Venta_Transferencia: '',
              Max_Venta_Transferencia: '',
              Sugerido_Venta_Transferencia: '',
              Costo_Transferencia: '',
              Comision_Efectivo_Transferencia: '',
              Pagar_Comision_Desde: '',
              Min_No_Cobro_Transferencia: '',
            }
          };
        } else {
          this.TransferenciaPesos = false;
          this.http.get(this.globales.ruta + 'php/monedas/buscar_valores_moneda.php', { params: { id_moneda: value } }).subscribe((data: any) => {
  
  
            this.MonedaParaTransferencia.Valores = data.query_data;
            this.TransferenciaModel.Tasa_Cambio = data.query_data.Sugerido_Compra_Efectivo;
            if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
              this.InputBolsaBolivares = true;
            } else {
              this.InputBolsaBolivares = false;
            }
  
          //  console.log(this.MonedaParaTransferencia);
  
          });
        }
      } else {
        this._limpiarCuentasBancarias();
        this.MonedaParaTransferencia.nombre = '';
        this.TransferenciaModel.Tasa_Cambio = '';
        this.InputBolsaBolivares = false;
      }
    }


    private _actualizarCuentasDestinatarios() {
      // console.log("actualizando cuentas destinatarios por cambio de moneda");
  
      if (this.ListaDestinatarios.length > 0) {
        let id_destinatarios = this._concatenarDocumentosDestinatarios();
        if (id_destinatarios != '') {
          let p = { moneda: this.MonedaParaTransferencia.id, ids: id_destinatarios };
          // console.log("parametros consulta", p);
          this.destinatarioService.GetCuentasDestinatarios(p).subscribe((data: any) => {
            // console.log(data);
  
            if (data.destinatarios.length > 0) {
              data.destinatarios.forEach((id_dest, i) => {
                // console.log(id_dest);
  
                let index_dest = this.ListaDestinatarios.findIndex(x => x.Numero_Documento_Destino == id_dest);
                this.ListaDestinatarios[index_dest].Cuentas = data.cuentas[i];
                const Id_Destinatario_Cuenta_Default = data.cuentas[0];
                if (data.cuentas[i].length == 0) {
                  this.ListaDestinatarios[index_dest].Id_Destinatario_Cuenta = '';
                }
              });
            }
  
            // if (data.codigo == 'success') {
            // data.query_data.forEach((cuentas,i) => {
            //   this.ListaDestinatarios[i].Cuentas = cuentas;
            // });
            // }else{
            //   this.swalService.ShowMessage(data);
            // }
          });
        }
      }
    }

    private _limpiarCuentasBancarias() {
      if (this.ListaDestinatarios.length > 1) {
        this.ListaDestinatarios.forEach((d, i) => {
          this.ListaDestinatarios[i].Cuentas = [];
        });
      }
    }

    private _concatenarDocumentosDestinatarios() {
      let ids = '';
      this.ListaDestinatarios.forEach(d => {
        if (d.Numero_Documento_Destino != '') {
          ids += d.Numero_Documento_Destino + ',';
        }
      });
      return ids;
    }

    ValidarTasaCambio(tasa_cambio) {
      let max = parseFloat(this.MonedaParaTransferencia.Valores.Max_Compra_Efectivo);
      let min = parseFloat(this.MonedaParaTransferencia.Valores.Min_Compra_Efectivo);
      let sug = parseFloat(this.MonedaParaTransferencia.Valores.Sugerido_Compra_Efectivo);
  
      if (tasa_cambio > max || tasa_cambio < min) {
        this.TransferenciaModel.Tasa_Cambio = sug;
        this.confirmacionSwal.title = "Alerta";
        this.confirmacionSwal.text = "La tasa digitada es inferior/superior al mínimo(" + min + ")/máximo(" + max + ") establecido para la moneda"
        this.confirmacionSwal.type = "warning"
        this.confirmacionSwal.show();
        return false;
      }
  
      return true;
    }
    
    CalcularCambio(valor: number, tasa: number, tipo: string, permisoJefe: boolean = false) {

      let conversion_moneda = 0;
      let bolsa = 0;
      if (this.TransferenciaModel.Bolsa_Bolivares != '0' && this.TransferenciaModel.Forma_Pago == "Credito") {
        bolsa = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
      }
  
      switch (tipo) {
        case 'recibido':
  
          if (!this.ValidarCupoTercero(tipo, bolsa)) {
            return;
          }
  
          if (!permisoJefe)
            if (!this.ValidarTasaCambio(tasa)) {
              return;
            }
  
          conversion_moneda = (valor / tasa);
          this.TransferenciaModel.Cantidad_Transferida = conversion_moneda;
          let conversion_con_bolsa = (valor / tasa) + bolsa;
          this.AsignarValorTransferirDestinatario(conversion_con_bolsa);
          break;
  
        case 'transferencia':
  
          if (!this.ValidarCupoTercero(tipo, bolsa)) {
            return;
          }
  
          if (!this.ValidarTasaCambio(tasa)) {
            return;
          }
  
          conversion_moneda = (valor * tasa);
          this.TransferenciaModel.Cantidad_Recibida = (conversion_moneda);
          let conversion_con_bolsa2 = valor + bolsa;
          this.AsignarValorTransferirDestinatario(conversion_con_bolsa2);
  
          break;
  
        default:
          this.confirmacionSwal.title = "Opcion erronea o vacía: " + tipo;
          this.confirmacionSwal.text = "La opcion para la operacion es erronea! Contacte con el administrador del sistema!";
          this.confirmacionSwal.type = "error";
          this.confirmacionSwal.show();
          break;
      }
    }

    LimpiarCantidades() {
      this.TransferenciaModel.Cantidad_Recibida = '';
      this.TransferenciaModel.Cantidad_Transferida = '';
  
      this.ListaDestinatarios.forEach((d, i) => {
        this.ListaDestinatarios[i].Valor_Transferencia = '';
      });
    }

    ValidarTasaCambioModal(tasa_cambio) {
      let max = parseFloat(this.MonedaParaTransferencia.Valores.Max_Compra_Efectivo);
      let min = parseFloat(this.MonedaParaTransferencia.Valores.Min_Compra_Efectivo);
      let sug = parseFloat(this.MonedaParaTransferencia.Valores.Sugerido_Compra_Efectivo);
      //tasa_cambio = parseFloat(tasa_cambio);
  
      if (tasa_cambio > max || tasa_cambio < min) {
        this.TransferenciaModel.Tasa_Cambio = sug;
        //ABRIR MODAL DE PERMISO PARA PROCEDER
        let p = { accion: "transferencia_cajero", value: tasa_cambio };
        this.permisoService._openSubject.next(p);
        return false;
      }
  
      return true;
    }

    
    async CalcularCambioMoneda(valor: string, tipo_cambio: string) {
      
     

      valor = valor.replace(/\./g, '');
  
      if (this.TransferenciaModel.Moneda_Destino == '') {
        this.ShowSwal('warning', 'Alerta', 'Debe escoger la moneda antes de realizar la conversión!');
        this.TransferenciaModel.Cantidad_Recibida = '';
        this.TransferenciaModel.Cantidad_Transferida = '';
        this.TransferenciaModel.Tasa_Cambio = '';
        return;
      }
  
      let tasa_cambio = this.TransferenciaModel.Tasa_Cambio;
      let value = parseFloat(valor);
  
  
      switch (tipo_cambio) {
        case 'por origen':
          if (value > 0) {
  
            this.CalcularCambio(value, tasa_cambio, 'recibido');
          } else {
            this.LimpiarCantidades();
          }
          break;
  
        case 'por destino':
          if (value > 0) {
  
            this.CalcularCambio(value, tasa_cambio, 'transferencia');
          } else {
            this.LimpiarCantidades();
          }
          break;
  
        case 'por tasa':
          if (!this.ValidarTasaCambioModal(tasa_cambio)) {
            return;
          }
  
          let valor_recibido = parseFloat(this.TransferenciaModel.Cantidad_Recibida);
  
          if (value > 0) {
            this.CalcularCambio(valor_recibido, tasa_cambio, 'recibido');
          } else {
            this.LimpiarCantidades();
          }
          break;
  
        default:
          this.confirmacionSwal.title = "Tipo cambio erroneo: " + tipo_cambio;
          this.confirmacionSwal.text = "La opcion para la conversion de la moneda es erronea! Contacte con el administrador del sistema!";
          this.confirmacionSwal.type = "error";
          this.confirmacionSwal.show();
          break;
      }
    }

    AsignarValorTransferirDestinatario(valor) {

      if (valor == '' || valor == '0') {
        this.ListaDestinatarios.forEach(d => {
          d.Valor_Transferencia = '';
        });
        return;
      }
  
      valor = (parseFloat(valor));
      let total_destinatarios = this.GetTotalTransferenciaDestinatarios();
      let count = this.ListaDestinatarios.length;
  
      setTimeout(() => {
        this.Asignar(valor, total_destinatarios, count);
      }, 300);
    }
  
    GetTotalTransferenciaDestinatarios(): number {

      let TotalTransferenciaDestinatario = 0;
  
      this.ListaDestinatarios.forEach(e => {
        if (e.Valor_Transferencia == undefined || isNaN(e.Valor_Transferencia) || e.Valor_Transferencia == '') {
          TotalTransferenciaDestinatario += 0;
        } else {
          TotalTransferenciaDestinatario += (parseFloat(e.Valor_Transferencia));
        }
      });
  
      return TotalTransferenciaDestinatario;
    }

    
    ValidarCupoTercero(tipo: string, bolsa: number) {


      //EL TIPO SE REFIERE A ORIGEN DEL CAMBIO SI ES DESDE MONEDA RECBIDA O DESDE MONEDA DE TRANSFERENCIA
      //Valores: recibido para moneda recibida, transferencia para moneda de transferencia
  
      if (this.TransferenciaModel.Forma_Pago == 'Credito') {
  
        if (this.TransferenciaModel.Cupo_Tercero == '' || this.TransferenciaModel.Cupo_Tercero == '0' || this.TransferenciaModel.Cupo_Tercero == undefined) {
          this.ShowSwal('warning', 'Alerta', 'El tercero no posee un cupo de crédito disponible!');
          this.TransferenciaModel.Cantidad_Recibida = '';
          return false;
        }
  
        let cupo = parseFloat(this.TransferenciaModel.Cupo_Tercero);
        let valor_digitado = tipo == 'recibido' ? parseFloat(this.TransferenciaModel.Cantidad_Recibida) : (parseFloat(this.TransferenciaModel.Tasa_Cambio) * parseFloat(this.TransferenciaModel.Cantidad_Transferida));
  
        if (cupo < valor_digitado) {
          this.ShowSwal('warning', 'Alerta', 'El cupo disponible es menor a la cantidad recibida!');
          this.TransferenciaModel.Cantidad_Recibida = cupo;
          this.TransferenciaModel.Cantidad_Transferida = cupo / parseFloat(this.TransferenciaModel.Tasa_Cambio);
  
          let conversion_con_bolsa2 = (cupo / parseFloat(this.TransferenciaModel.Tasa_Cambio)) + bolsa;
          this.AsignarValorTransferirDestinatario(conversion_con_bolsa2);
          return false;
        }
  
        return true;
      } else {
        return true;
      }
    }
  
    reduce(a) {
      let suma = 0;
      a.forEach((element) => {
        suma += parseFloat(element.Valor_Transferencia)
      })
      return suma;
    }
  
    reduceCopia(a) {
      let suma = 0;
      a.forEach((element) => {
        suma += parseFloat(element.copia)
      })
      return suma;
    }
  
    cleanCopia() {
      this.ListaDestinatarios.forEach((element, index) => {
        this.ListaDestinatarios[index].copia = 0
        this.ListaDestinatarios[index].Valor_Transferencia = 0
      })
    }
  
    doConversion(valor, i) {
      let MultiplicadorDeConversion = 0;
      this.Monedas.forEach(element => {
        if (element.Id_Moneda == this.TransferenciaModel.Moneda_Destino) {
          MultiplicadorDeConversion = element.valor_moneda.Sugerido_Compra_Efectivo
        }
      });
  
  
      let valorNew = parseFloat(valor.replace(/\./g, ''));
      let aEntregar = this.reduce(this.ListaDestinatarios)
      let aEntregarCopia = this.reduceCopia(this.ListaDestinatarios)
      //Valor real 
      let nuevoValorConvertido1 = valorNew / MultiplicadorDeConversion
      let nuevoValorConvertidoCopia1 = valorNew
      //valor total convertido
      let nuevoValorConvertido2 = this.TransferenciaModel.Cantidad_Recibida / MultiplicadorDeConversion
      let nuevoValorConvertidoCopia2 = this.TransferenciaModel.Cantidad_Recibida
  
  
      if (valorNew > this.TransferenciaModel.Cantidad_Recibida) {
        this.ValidarValorTransferirDestinatario2(nuevoValorConvertido2.toString(), i)
      } else {
        if (aEntregarCopia > nuevoValorConvertidoCopia2) {
          this.cleanCopia()
          this.ListaDestinatarios[i].copia = nuevoValorConvertidoCopia2
          this.ListaDestinatarios[i].Valor_Transferencia = nuevoValorConvertido2
        } else {
          this.ValidarValorTransferirDestinatario2(nuevoValorConvertido1.toString(), i)
        }
      }
    }
  
}
