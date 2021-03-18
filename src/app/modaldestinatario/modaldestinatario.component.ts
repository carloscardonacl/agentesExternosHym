import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';


import { DestinatarioModel } from '../Modelos/DestinatarioModel';
import { BancoService } from '../services/banco.service';
import { DestinatarioService } from '../services/destinatario.service';
import { SwalService } from '../services/swal.service';
import { TipodocumentoService } from '../services/tipodocumento.service';
import { ValidacionService } from '../services/validacion.service';
import { GeneralService } from '../shared/services/general/general.service';
import '../../styles.scss';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-modaldestinatario',
  templateUrl: './modaldestinatario.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ModaldestinatarioComponent implements OnInit {

  @Input() AbrirModal: Observable<any> = new Observable();
  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();
  @Output() ActualizarCuentasDestinatario: EventEmitter<any> = new EventEmitter();
  @Output() IncluirDestinatarioEnTransferencia: EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalDestinatario') ModalDestinatario: any;
  @ViewChild('ModalCNE') ModalCNE: any;

  public paisDefault: string;
  public id_pais: string;

  public rowDefault = {
    posicion: 0,
    fila: '0'
  };

  public BancosPais: Array<any> = [];
  public Paises: any = [];
  public Monedas: any = [];
  public TiposDocumento: any = [];
  public TiposCuenta: any = [];
  public BancosCuentas: Array<any> = [
    {
      cuenta_index: "0",
      Bancos: []
    }
  ];
  public Lista_Cuentas_Destinatario: any = [{
    Id_Pais: '2',
    Id_Banco: '',
    Id_Tipo_Cuenta: '',
    Numero_Cuenta: '',
    Bancos: [],
    EsVenezolana: false
  }];

  public openSubscription: any;
  public Editar: boolean = false;
  public SePuedeAgregarMasCuentas: boolean = true;
  public accion: string = 'crear';
  public MensajeGuardar: string = 'Se dispone a guardar este destinatario';

  public DestinatarioModel: DestinatarioModel = new DestinatarioModel();
  public urlCNE: string = '';

  constructor(public generalService: GeneralService,
    private swalService: SwalService,
    private validacionService: ValidacionService,
    private destinatarioService: DestinatarioService,
    private tipoDocumentoService: TipodocumentoService,
    private bancoService: BancoService,
    private login : LoginService
    ) {
    this.GetPaises();
    this.GetTiposCuenta();
  }

  ngOnInit() {


    this.openSubscription = this.AbrirModal.subscribe((data: any) => {
    console.log(data , 'modal');
    
      if (data.id_destinatario != "0" && data.accion == 'editar') {
        this.Editar = true;
        this.accion = data.accion;
        let p = { id_destinatario: data.id_destinatario };
        this.MensajeGuardar = 'Se dispone a actualizar este destinatario';

        this.destinatarioService.getDestinatario(p).subscribe((d: any) => {
          setTimeout(() => {
            if (d.codigo == 'success') {
              this.AsignarDatosModelo(d.query_data.destinatario);
              this.Lista_Cuentas_Destinatario = d.query_data.cuentas;
              this.GetBancosCuentas();
              this.SePuedeAgregarMasCuentas = true;
              this.ModalDestinatario.show();
            } else {

              this.swalService.ShowMessage(d);
            }
          }, 1500);
        });
      } else if (data.id_destinatario != "0" && data.accion == 'editar cuentas') {
        this.Editar = true;
        this.accion = data.accion;
        let p = { id_destinatario: data.id_destinatario };
        this.MensajeGuardar = 'Se dispone a actualizar este destinatario';

        this.destinatarioService.getDestinatario(p).subscribe((d: any) => {
          setTimeout(() => {
            if (d.codigo == 'success') {
              this.AsignarDatosModelo(d.query_data.destinatario);
              this.Lista_Cuentas_Destinatario = d.query_data.cuentas;
              this.GetBancosCuentas();
              this.SePuedeAgregarMasCuentas = true;
              this.ModalDestinatario.show();
            } else {

              this.swalService.ShowMessage(d);
            }
          }, 1500);
        });
      } else if (data.id_destinatario != "0" && data.accion == 'crear especial') {
        this.MensajeGuardar = 'Se dispone a guardar este destinatario';
        this.DestinatarioModel.Id_Destinatario = data.id_destinatario;
        this.Editar = false;
        this.accion = data.accion;
        this.GetPaises();
        this.ModalDestinatario.show();
      } else if (data.id_destinatario == "0" && data.accion == 'crear') {
        this.MensajeGuardar = 'Se dispone a guardar este destinatario';
        this.Editar = false;
        this.accion = data.accion;
        this.ModalDestinatario.show();
      }
    });
  }

  ngOnDestroy() {
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }
  // Solo para iniciar cuando se abre por primera vez //TODO se carga por defecto venezuela en identificacion
  /**-----------------------------------------------------------------------------------------------*/

  async GetPaises() {
    await this.generalService.getPaises().then((result) => {
      this.Paises = result;
      let fullPais = result.find((pais: { Nombre: string; }) => pais.Nombre == 'Venezuela');
      this.paisDefault = fullPais.Id_Pais;
      this.Lista_Cuentas_Destinatario[this.rowDefault.posicion].Id_Pais = this.paisDefault //Para asignar venezuela al default 
    }).catch((err) => {
      // console.log(err);
    });
    this.GetBancosPais(this.rowDefault.fila);
    this.FiltrarDatosNacionalidad();
    this.GetTiposCuenta();
  }
  /**-----------------------------------------------------------------------------------------------*/

  GetTiposCuenta() {
    setTimeout(() => {
      this.TiposCuenta = this.generalService.getTiposCuenta();
    }, 1000);
  }

  GetBancosCuentas() {
    if (this.Lista_Cuentas_Destinatario.length > 0) {

      this.Lista_Cuentas_Destinatario.forEach((cta, i) => {
        this.GetBancosPais(i);
        //this.CheckCuentasVenezolanas(i);
      });
    }
  }

  AsignarDatosModelo(data: any) {
    this.DestinatarioModel.Id_Destinatario = data.Id_Destinatario;
    this.DestinatarioModel.Nombre = data.Nombre;
    this.DestinatarioModel.Tipo_Documento = data.Tipo_Documento;
    this.DestinatarioModel.Estado = data.Estado;
    this.DestinatarioModel.Id_Pais = data.Id_Pais;

    this.FiltrarDatosNacionalidad(true);
  }

  GuardarDestinatario() {

    this.DestinatarioModel.Cuentas = this.Lista_Cuentas_Destinatario;

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    console.log(this.DestinatarioModel);

    this.LimpiarBancosModelo();
    this.DestinatarioModel = this.generalService.limpiarString(this.DestinatarioModel);

    let data = new FormData();
    this.DestinatarioModel.Id_Agente_Externo = this.login.user().Id_Agente_Externo
    let modelo = this.generalService.normalize(JSON.stringify(this.DestinatarioModel));
     modelo = this.generalService.normalize(JSON.stringify(this.DestinatarioModel));
    data.append('modelo', modelo);

    if (this.Editar) {

      this.destinatarioService.editDestinatario(data)
       /*  .catch(error => {
          this.swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        }) */
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            switch (this.accion) {
              case 'editar':
                this.ActualizarTabla.emit();
                break;

              case 'editar cuentas':
                let objRespuesta = { willdo: "actualizar", id_destinatario: this.DestinatarioModel.Id_Destinatario };
                this.ActualizarCuentasDestinatario.emit(objRespuesta);
                break;

              default:
                break;
            }

            this.CerrarModal();
          }

          this.swalService.ShowMessage(data);
        });
    } else {

      this.destinatarioService.saveDestinatario(data)
      /*   .catch(error => {
          this.swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        }) */
        .subscribe((data: any) => {

          if (data.codigo == 'success') {
            switch (this.accion) {
              case 'crear':
                this.ActualizarTabla.emit();
                break;
              case 'crear especial':
                let objRespuesta = { willdo: "actualizar", id_destinatario: this.DestinatarioModel.Id_Destinatario };
                console.log(objRespuesta,'respuestEmiter');
                
                this.IncluirDestinatarioEnTransferencia.emit(objRespuesta);
                break;

              default:
                break;
            }

            this.CerrarModal();
          }

          this.swalService.ShowMessage(data);
        });
    }
  }

  ValidateBeforeSubmit() {
    if (!this.validacionService.validateString(this.DestinatarioModel.Nombre, 'Nombre Destinatario')) {
      return false;
    } else if (!this.validacionService.validateString(this.DestinatarioModel.Tipo_Documento, 'Tipo de documento')) {
      return false;
    } else if (!this.validacionService.validateNumber(this.DestinatarioModel.Id_Pais, 'Pais')) {
      return false;
    } else if (!this.validacionService.validateString(this.DestinatarioModel.Id_Destinatario, 'Numero Identificacion')) {
      return false;
    } else if (!this.ValidateCuentas()) {
      return false;
    }

    return true;
  }

  ValidateCuentas() {
    for (let i = 0; i < this.Lista_Cuentas_Destinatario.length; i++) {
      for (const key in this.Lista_Cuentas_Destinatario[i]) {
        if (!Array.isArray(this.Lista_Cuentas_Destinatario[i][key]) && typeof (this.Lista_Cuentas_Destinatario[i][key]) != 'boolean') {
          if (this.Lista_Cuentas_Destinatario[i][key] == '') {
            this.swalService.ShowMessage(['warning', 'Faltan Datos', 'Faltan datos en la(s) cuenta(s) actuales, revise por favor!']);
            return false;
          }
        }
      }
    }

    return true;
  }

  LimpiarBancosModelo() {
    for (let i = 0; i < this.DestinatarioModel.Cuentas.length; i++) {
      this.DestinatarioModel.Cuentas[i].Bancos = [];
    }
  }

  CerrarModal() {
    if (this.accion == 'crear especial') {
      let objRespuesta = { willdo: "limpiar campo id dest", id_destinatario: '' };
      this.IncluirDestinatarioEnTransferencia.emit(objRespuesta);
    }

    this.LimpiarModelo();
    this.ModalDestinatario.hide();
  }

  LimpiarModelo() {
    this.DestinatarioModel = new DestinatarioModel();
    this.Lista_Cuentas_Destinatario = [{
      Id_Pais: '',
      Id_Banco: '',
      Id_Tipo_Cuenta: '',
      Numero_Cuenta: '',
      Bancos: [],
      EsVenezolana: false
    }];
    this.SePuedeAgregarMasCuentas = true;
  }

  FiltrarDatosNacionalidad(conservarTipoDocumento: boolean = false) {
    if (this.DestinatarioModel.Id_Pais == '') {
      this.DestinatarioModel.Id_Pais = this.paisDefault;
      this.TiposDocumento = [];
    }

    let p = { id_pais: this.DestinatarioModel.Id_Pais };
    this.tipoDocumentoService.getTiposDocumentoPais(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.TiposDocumento = data.query_data;
        if (!conservarTipoDocumento)
          this.DestinatarioModel.Tipo_Documento = '';

      } else {

        this.TiposDocumento = [];
        this.DestinatarioModel.Tipo_Documento = '';
        this.swalService.ShowMessage(data);
      }
    });

  }

  ValidarCedula() {
    if (this.DestinatarioModel.Id_Destinatario != '') {
      let id = this.DestinatarioModel.Id_Destinatario;
      this.generalService.checkIdentificacion(id).subscribe((data: any) => {
        if (data.codigo != 'success') {
          this.DestinatarioModel.Id_Destinatario = '';
          this.swalService.ShowMessage(data);
        }
      });
    }
  }

  BuscarCNE() {

    var cedula = this.DestinatarioModel.Id_Destinatario;
    if (cedula == undefined || cedula == '') {
      this.swalService.ShowMessage(['warning', 'Alerta', 'Debe colocar un número de identificación para proseguir!']);
      this.DestinatarioModel.Tipo_Documento = '';
      return;
    }

    var tipo_doc = this.DestinatarioModel.Tipo_Documento;
    if (tipo_doc == '') {
      return;
    }

    let countryObject = this.Paises.find(x => x.Id_Pais == this.DestinatarioModel.Id_Pais);

    if (!this.generalService.IsObjEmpty(countryObject)) {
      if (countryObject.Nombre == 'Venezuela') {

        switch (tipo_doc) {
          case "V": {
            let urlCne = "http://www.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=" + cedula + "&output=embed";
            this.urlCNE = urlCne;
            this.ModalCNE.show();
            //window.open(urlCne, '_blank');

            break;
          }
          case "E": {
            let urlCne = "http://www.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=E&cedula=" + cedula + "&output=embed";
            this.urlCNE = urlCne;
            this.ModalCNE.show();
            // window.open(urlCne, '_blank');
            break;
          }
          default: {
          }
        }
      }
    }
  }

  AgregarOtraCuenta() {
    let longitudCuentas = this.Lista_Cuentas_Destinatario.length;

    if (longitudCuentas == 0) {

      let nuevaCuenta = {
        Id_Pais: '',
        Id_Banco: '',
        Id_Tipo_Cuenta: '',
        Numero_Cuenta: '',
        Bancos: [],
        EsVenezolana: false
      };

      this.Lista_Cuentas_Destinatario.push(nuevaCuenta);


    } else if (this.SePuedeAgregarMasCuentas && this.Lista_Cuentas_Destinatario[(longitudCuentas - 1)].Id_Tipo_Cuenta != '') {

      let nuevaCuenta = {
        Id_Pais: '',
        Id_Banco: '',
        Id_Tipo_Cuenta: '',
        Numero_Cuenta: '',
        Bancos: [],
        EsVenezolana: false
      };
      this.Lista_Cuentas_Destinatario.push(nuevaCuenta);
      this.Lista_Cuentas_Destinatario[longitudCuentas].Id_Pais = this.paisDefault //Para asignar venezuela al default 
      this.GetBancosPais(longitudCuentas);

      //let newLength = this.Lista_Cuentas_Destinatario.length;
      //let bancosCuentaObj = {cuenta_index:(newLength - 1).toString(), Bancos:[]};
      //this.BancosCuentas.push(bancosCuentaObj);

      this.SePuedeAgregarMasCuentas = false;
    } else {

      this.swalService.ShowMessage(['warning', 'Faltan Datos', 'Faltan datos en la(s) cuenta(s) actuales, revise por favor!']);
    }
  }

  GetBancosPais(cuentaIndex: string) {
    //let index_bancos_cuenta = this.BancosCuentas.findIndex(x => x.cuenta_index == cuentaIndex);
    let id_pais = this.Lista_Cuentas_Destinatario[cuentaIndex].Id_Pais;

    if (id_pais == '') {
      this.Lista_Cuentas_Destinatario[cuentaIndex].Bancos = [];
      this.Lista_Cuentas_Destinatario[cuentaIndex].Id_Banco = '';
    } else {

      let p = { id_pais: id_pais };
      this.bancoService.getListaBancosByPais(p).subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.Lista_Cuentas_Destinatario[cuentaIndex].Bancos = data.query_data;
          this.CheckCuentasVenezolanas(cuentaIndex);
        } else {
          this.Lista_Cuentas_Destinatario[cuentaIndex].Bancos = [];
          this.swalService.ShowMessage(data);
        }
      });
    }
  }

  codigoBanco(posicion, texto) {

    let country = this.Lista_Cuentas_Destinatario[posicion].Id_Pais;
    let nroCuenta = this.Lista_Cuentas_Destinatario[posicion].Numero_Cuenta;

    if (country == "2") {
      switch (texto) {
        case "check": {
          var buscarBanco = this.BancosCuentas[posicion].Bancos.findIndex(x => x.Id_Banco === nroCuenta);
          this.Lista_Cuentas_Destinatario[posicion].Numero_Cuenta = this.BancosCuentas[posicion].Bancos[buscarBanco].Identificador;
          break;
        }
        case "input": {

          var match = nroCuenta.substring(0, 4);
          var buscarBanco = this.Lista_Cuentas_Destinatario[posicion].Bancos.findIndex(x => x.Identificador === match);

          if (buscarBanco > -1) {
            this.Lista_Cuentas_Destinatario[posicion].Id_Banco = this.Lista_Cuentas_Destinatario[posicion].Bancos[buscarBanco].Id_Banco;
          } else {
            this.Lista_Cuentas_Destinatario[posicion].Id_Banco = '';
            this.Lista_Cuentas_Destinatario[posicion].Numero_Cuenta = '';
            this.swalService.ShowMessage(['warning', "Alerta", "Este banco no se encuentra registrado!"]);
          }
          break;
        }
      }
    }
  }

  //VALIDAR LA LONGITUD DEL NUMERO DE CUENTA INGRESADO
  validarBanco(i: string, nroCuenta: string) {

    if (nroCuenta != '') {
      setTimeout(() => {

        //var idpais = ((document.getElementById("Id_Pais" + i) as HTMLInputElement).value);
        let ctaObject = this.Lista_Cuentas_Destinatario[i];
        let countryObject = this.Paises.find(x => x.Id_Pais == ctaObject.Id_Pais);

        if (!this.generalService.IsObjEmpty(ctaObject) && !this.generalService.IsObjEmpty(countryObject)) {

          if (countryObject.Nombre == 'Venezuela') {

            if (countryObject.Cantidad_Digitos_Cuenta != 0) {
              // Se usa variable auxiliar para formatear la longitud del input 
              let aux = nroCuenta.replace(/-/g, '')
              let longitud = aux.length;
              // console.log(longitud);


              if (longitud != parseInt(countryObject.Cantidad_Digitos_Cuenta)) {
                this.swalService.ShowMessage(['warning', 'Alerta', 'Digite la cantidad correcta de dígitos de la cuenta(' + countryObject.Cantidad_Digitos_Cuenta + ')']);
                this.SePuedeAgregarMasCuentas = false;
                return;
              }
            }

            let p = { cta_bancaria: nroCuenta };
            this.validacionService.ValidateCuentaBancaria(p).subscribe((data) => {
              if (data == 1) {
                this.swalService.ShowMessage(['warning', 'Alerta', 'La cuenta que intenta registrar ya se encuentra en la base de datos!']);
                this.SePuedeAgregarMasCuentas = false;
                this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
              } else {
                this.SePuedeAgregarMasCuentas = true;
              }
            });
          } else {

            let p = { cta_bancaria: nroCuenta };
            this.validacionService.ValidateCuentaBancaria(p).subscribe((data) => {
              if (data == 1) {
                this.swalService.ShowMessage(['warning', 'Alerta', 'La cuenta que intenta registrar ya se encuentra en la base de datos!']);
                this.SePuedeAgregarMasCuentas = false;
                this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
              } else {
                this.SePuedeAgregarMasCuentas = true;
              }
            });
          }
        }
      }, 700);
    }
  }

  CheckCuentasVenezolanas(ctaIndex: string = '') {
    let veObj = this.Paises.find(x => x.Nombre == 'Venezuela');
    if (!this.generalService.IsObjEmpty(veObj)) {
      if (ctaIndex != '') {
        if (this.Lista_Cuentas_Destinatario[ctaIndex].Id_Pais == veObj.Id_Pais) {
          this.Lista_Cuentas_Destinatario[ctaIndex].EsVenezolana = true;
        } else {
          this.Lista_Cuentas_Destinatario[ctaIndex].EsVenezolana = false;
        }
      } else {

        this.Lista_Cuentas_Destinatario.forEach((cta, i) => {
          if (cta.Id_Pais == veObj.Id_Pais) {
            this.Lista_Cuentas_Destinatario[i].EsVenezolana = true;
          } else {
            this.Lista_Cuentas_Destinatario[i].EsVenezolana = false;
          }
        });
      }
    } else {
      this.Lista_Cuentas_Destinatario.forEach((cta, i) => {
        this.Lista_Cuentas_Destinatario[i].EsVenezolana = false;
      });
      //this.swalService.ShowMessage(['warning', 'Alerta', 'Hay una incosistencia en la busqueda del pais, contacte con el administrador del sistema!']);
    }
  }

  SetIdentificadorCuenta(idBanco, i) {
    //comprobar de que pais es el banco
    //buscar el identificador del banco si posee

    let cuentaDestinatario = this.Lista_Cuentas_Destinatario[i].Numero_Cuenta;

    if (cuentaDestinatario == '') {
      let p = { id_banco: idBanco };
      this.bancoService.getIdentificadorBanco(p).subscribe((data: string) => {
        this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = data;
      });
    }
  }

  EliminarCuentaDestinatario(posicion: string) {

    if (this.Lista_Cuentas_Destinatario.length == 1) {
      this.swalService.ShowMessage(['warning', 'Alerta', 'Debe existir al menos una cuenta asociada al destinatario']);
      this.SePuedeAgregarMasCuentas = false;
      return;
    }

    //this.BancosCuentas[posicion].splice(posicion, 1);
    this.Lista_Cuentas_Destinatario.splice(posicion, 1);

    this.SePuedeAgregarMasCuentas = true;
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }
}
