import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { GeneralService } from '../shared/services/general/general.service';
/* import { SwalService } from '../../../shared/services/swal/swal.service'; */
import { ToastService } from '../services/toast.service';

import { TransferenciaService } from '../services/transferencia.service';
import { Observable, Subject } from 'rxjs';
import { NormailizerService } from '../normailizer.service';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { MonedaService } from '../services/moneda.service';
import { DestinatarioService } from '../services/destinatario.service';

@Component({
  selector: 'app-tablatransferenciascajero',
  templateUrl: './tablatransferenciascajero.component.html',
  styleUrls: [/*  '../../styles.scss', */'./tablatransferenciascajero.component.scss'],
  
  providers: [NormailizerService]
})
export class TablatransferenciascajeroComponent implements OnInit, OnDestroy {

  public ControlVisibilidadTransferencia: any = {
    DatosCambio: true,
    Destinatarios: true,
    DatosRemitente: true,
    DatosCredito: false,
    DatosConsignacion: false,
    SelectCliente: false
  };
  @Input() ActualizarTabla: Observable<any> = new Observable();
  private _updateSubscription: any;
  public ActulizarTablaRecibos: Subject<any> = new Subject<any>();
  @ViewChild('ModalAnularTransferencia') ModalAnularTransferencia: any;

  public Monedas: any = [];
  public AbrirModalDetalleRecibo: Subject<any> = new Subject();
  public RecibosTransferencia: Array<any> = [];
  public Cargando: boolean = false;
  public RutaGifCargando: string;
  public Id_Transferencia_Anular: string = '';
  public MotivoAnulacion: string = '';

  public Filtros: any = {
    remitente: '',
    recibo: '',
    recibido: '',
    transferido: '',
    tasa: '',
    estado: ''
  };
  public InputBolsaBolivares: boolean = false;

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
  public MonedasTransferencia: any = [];


  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  Transferencia = [];
  Transferencia1 = true;
  Transferencia2 = false;

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

  public TransferenciaPesos: boolean = false;
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


  constructor(private _generalService: GeneralService,
    private http: HttpClient,
    public globales: Globales,
/*     private _swalService: SwalService, */
    private _toastService: ToastService,
    private _normalizeService: NormailizerService,
    private _transferenciaService: TransferenciaService,
    private _monedaService: MonedaService,
    private destinatarioService: DestinatarioService
    ) {
    //this.RutaGifCargando = _generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
  }

  ngOnInit() {
    this._updateSubscription = this.ActualizarTabla.subscribe(data => {
      this.ConsultaFiltrada();
    });
  }

  ngOnDestroy(): void {
    if (this._updateSubscription != null) {
      this._updateSubscription.unsubscribe();
    }
  }

  CambiarVista(tipo) {

    // this.MonedasCambio = [];

    switch (tipo) {

      case "Transferencia": {
        this.Transferencia1 = false;
        this.Transferencia2 = true;
        this.SetMonedaTransferencia(1);


        break;
      }
     
      
    }
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
  private _concatenarDocumentosDestinatarios() {
    let ids = '';
    this.ListaDestinatarios.forEach(d => {
      if (d.Numero_Documento_Destino != '') {
        ids += d.Numero_Documento_Destino + ',';
      }
    });
    return ids;
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



  GetRecibosTransferencias() {
    this._transferenciaService.getRecibosTransferenciasFuncionario(this._generalService.SessionDataModel.funcionarioData.Identificacion_Funcionario).subscribe(data => {
      if (data.codigo == 'success') {
        this.RecibosTransferencia = data.query_data;
      } else {
        this.RecibosTransferencia = [];
      }
    });
  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    // params.tam = this.pageSize;
    params.id_funcionario = this._generalService.SessionDataModel.funcionarioData.Id_Agente_Externo;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1;
      params.pag = this.page;
    }


    if (this.Filtros.remitente.trim() != "") {
      params.remitente = this.Filtros.remitente;
    }

    if (this.Filtros.recibo.trim() != "") {
      params.recibo = this.Filtros.recibo;
    }

    if (this.Filtros.recibido.trim() != "") {
      params.recibido = this.Filtros.recibido;
    }

    if (this.Filtros.transferido.trim() != "") {
      params.transferido = this.Filtros.transferido;
    }

    if (this.Filtros.tasa.trim() != "") {
      params.tasa = this.Filtros.tasa;
    }

    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }

    return params;
  }
  

  ConsultaFiltrada(paginacion: boolean = false) {
  console.log('paginacion',paginacion);
  
    var p = this.SetFiltros(paginacion);

    if (p === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;
    this._transferenciaService.getRecibosTransferenciasFuncionario2(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.RecibosTransferencia = data.query_data;
        this.TotalItems = data.numReg;
      } else {
        this.RecibosTransferencia = [];
        // this._swalService.ShowMessage(data);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion(data.query_data);
    });
  }

  ResetValues() {
    this.Filtros = {
      remitente: '',
      recibo: '',
      recibido: '',
      transferido: '',
      tasa: '',
      estado: ''
    };
  }

  SetInformacionPaginacion(data: any) {
    // console.log(data);
    this.TotalItems = data.length
    // console.log('', this.TotalItems);
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;
    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }


  AbrirModalAnularTransferencia(idTransferenciaAnular: string) {
    
    this.Id_Transferencia_Anular = idTransferenciaAnular;
    this.ModalAnularTransferencia.show();
  }

  CerrarModalAnular() {
    this.Id_Transferencia_Anular = '';
    this.MotivoAnulacion = '';
    this.ModalAnularTransferencia.hide();
  }

  AnularTransferencia() {
    console.log('anular');
    
    let datos = new FormData();

    let info = this._normalizeService.normalize(JSON.stringify(this.MotivoAnulacion));
    // console.log(info);

    datos.append("id_transferencia", this.Id_Transferencia_Anular);
    datos.append("motivo_anulacion", info);

    this._transferenciaService.anularReciboTransferencias(datos)
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.ModalAnularTransferencia.hide();
          this.MotivoAnulacion = '';
         /*  this._swalService.ShowMessage(data); */
          this.ConsultaFiltrada();
        } else {

         /*  this._swalService.ShowMessage(data); */
        }
      });
  }

  AbrirDetalleRecibo(transferencia: any) {
    this.AbrirModalDetalleRecibo.next(transferencia);
  }

  AlertarRecibo(transferencia: any) {
    let data :any ={Id_Transferencia:transferencia.Id_Transferencia}
    this._transferenciaService.AlertarTransferencia(data).subscribe((data:any)=>{
      if (data.codigo == 'success') {
/*         this._swalService.ShowMessage(data); */
      } else {

    /*     this._swalService.ShowMessage(data); */
      }
    })

   
  }

  printReciboTransferencia(id: string) {
    this.http.get(this.globales.rutaNueva + 'print-cambio', { params: { id: id, modulo: 'transferencia' }, responseType: 'blob' }).subscribe((data: any) => {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

  }

  private _limpiarCuentasBancarias() {
    if (this.ListaDestinatarios.length > 1) {
      this.ListaDestinatarios.forEach((d, i) => {
        this.ListaDestinatarios[i].Cuentas = [];
      });
    }
  }

  

}
