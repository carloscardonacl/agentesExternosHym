import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';


@Injectable()
export class Globales {
  ruta: string = 'https://grupohym.com.co/customback/';
  rutaNueva: string = 'https://backnew.grupohym.com.co/';
  public urlRiff = '';
  public urlCne = '';
  public Monedas: any = [];
  public Paises: any = [];
  public TipoDocumentoExtranjero: any = [];
  public CuentasPersonalesPesos: any = [];
  public FuncionariosCaja: any = [];
  public CorresponsalesBancarios: any = [];
  public ServiciosExternos: any = [];
  public Departamentos: any = [];
  public TipoDocumentoNacionales: any = [];
  public TiposCuenta: any = [];
  constructor(private client: HttpClient) {
    this.BuscarMonedas();
    this.BuscarPaises();
    this.BuscarTiposDocumentos();
    this.BuscarTiposDocumentosNacionales();
    this.BuscarTiposCuenta();
    this.BuscarCuentasPersonales();
    this.BuscarCajerosSitema();
    this.BuscarCorresponsales();
    this.BuscarServiciosExternos();
    this.BuscarDepartamentos();
  }

  BuscarMonedas(): void {
    this.client.get(this.rutaNueva + 'monedas').subscribe((data) => {
      this.Monedas = data;
    });
  }

  BuscarPaises() {
    this.Paises = this.client.get(this.rutaNueva + 'genericos/paises').toPromise().then((data: any) => {
      return data;
    });
  }

  BuscarTiposDocumentos(): void {
    this.client.get(this.rutaNueva + 'genericos/tipo-documento-extrangeros').subscribe((data: any) => {
      this.TipoDocumentoExtranjero = data;

    });
  }

  BuscarTiposDocumentosNacionales(): void {
    this.client.get(this.rutaNueva + 'genericos/tipo-documento-nacionales').subscribe((data: any) => {
      this.TipoDocumentoNacionales = data;

    });
  }

  BuscarCuentasPersonales(moneda: string = 'Pesos'): void {
    this.client.get(this.ruta + 'php/cuentasbancarias/buscar_cuentas_bancarias_por_moneda.php', { params: { moneda: moneda } }).subscribe((data: any) => {
      this.CuentasPersonalesPesos = data;
    });
  }

  BuscarCajerosSitema() {
    this.client.get(this.ruta + 'php/pos/lista_cajeros_sistema.php').subscribe((data: any) => {
      this.FuncionariosCaja = data;
    });
  }

  BuscarCorresponsales() {
    this.client.get(this.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Corresponsal_Bancario' } }).subscribe((data: any) => {
      this.CorresponsalesBancarios = data;
    });
  }

  BuscarServiciosExternos() {
    this.client.get(this.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio_Externo' } }).subscribe((data: any) => {
      this.ServiciosExternos = data;
    });
  }

  BuscarDepartamentos() {
    this.client.get(this.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Departamento' } }).subscribe((data: any) => {
      this.Departamentos = data;
    });
  }

  BuscarTiposCuenta() {
    this.client.get(this.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Cuenta' } }).subscribe((data: any) => {
      this.TiposCuenta = data;
    });
  }

  IsObjEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  buscarRiff() {
    this.urlRiff = "http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp";
    //this.frameRiff = !this.frameRiff;
    window.open(this.urlRiff, '_blank');
  }

  buscarCne() {
    this.urlCne = "http://www.cne.gob.ve/web/index.php";
    //this.frameRiff = !this.frameRiff;
    window.open(this.urlCne, '_blank');
  }
}
