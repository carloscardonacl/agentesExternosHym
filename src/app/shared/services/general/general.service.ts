import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SessionDataModel } from '../../../Modelos/SessionDataModel';

@Injectable()
export class GeneralService {

  public SessionDataModel: SessionDataModel = new SessionDataModel();
  public Funcionario: any = '';
  public Oficina: any = '';
/*   public Caja: any = ''; */
  public RutaImagenes: string = this.globales.ruta + "IMAGENES/";
  public RutaPrincipal: string = this.globales.ruta;
  public FechaActual: string;
  public HoraActual: string;
  public FullFechaActual: string;
  public MesActual: string;
  public MesActualDosDigitos: string;
  public DiaActual: string;
  public DiaActualDosDigitos: string;
  public AnioActual: string;
  public Meses: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public Meses2: Array<any> = [{ Numero: 1, Mes: 'Enero' }, { Numero: 2, Mes: 'Febrero' }, { Numero: 3, Mes: 'Marzo' }, { Numero: 4, Mes: 'Abril' }, { Numero: 5, Mes: 'Mayo' }, { Numero: 6, Mes: 'Junio' }, { Numero: 7, Mes: 'Julio' }, { Numero: 8, Mes: 'Agosto' }, { Numero: 9, Mes: 'Septiembre' }, { Numero: 10, Mes: 'Octubre' }, { Numero: 11, Mes: 'Noviembre' }, { Numero: 12, Mes: 'Diciembre' }];
  public Anios: Array<number> = [];

 
  constructor(private client: HttpClient,
    private globales: Globales,
    private datePipe: DatePipe) {
    this.Funcionario = JSON.parse(localStorage.getItem('User'));
    this.Oficina = JSON.parse(localStorage.getItem('Oficina'));
   /*  this.Caja = JSON.parse(localStorage.getItem('Caja')); */
    this.FechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.HoraActual = this.datePipe.transform(new Date(), 'HH:mm:ss');
    this.FullFechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.MesActual = this.datePipe.transform(new Date(), 'M');
    this.MesActualDosDigitos = this.datePipe.transform(new Date(), 'MM');
    this.DiaActual = this.datePipe.transform(new Date(), 'd');
    this.DiaActualDosDigitos = this.datePipe.transform(new Date(), 'dd');
    this.AnioActual = this.datePipe.transform(new Date(), 'y');
    this.BuildAniosConsulta();
    this.globales.BuscarPaises();
  }

  public checkIdentificacion(id: string): Observable<any> {
    let p = { id: id };
    return this.client.get(this.globales.ruta + 'php/GENERALES/validar_numero_identificacion.php', { params: p });
  }

  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç'´",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc  ",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();

  public verifyMajorCode(codigo: string): Observable<any> {
    let p = { codigo: codigo };
    return this.client.get(this.globales.ruta + 'php/GENERALES/VerificarCodigoPersonal.php', { params: p });
  }

  public getDepCiuOficina(oficina: string): Observable<any> {
    let p = { oficina: oficina };
    return this.client.get(this.globales.ruta + 'php/oficinas/get_departamento_ciudad_oficina.php', { params: p });
  }

  public GetMotivosDevolucion(): Observable<any> {
    return this.client.get(this.globales.ruta + 'php/GENERALES/motivosdevolucion/get_motivos_devolucion.php');
  }

  public GetTiposAjuste(): Observable<any> {
    return this.client.get(this.globales.ruta + 'php/GENERALES/tiposajuste/get_tipos_ajuste.php');
  }

  public getPaises() {
    return this.globales.Paises;
  }

  public getMonedas() {
    return this.globales.Monedas;
  }

  BuscarMonedas(): Observable<any> {
    return this.client.get(this.globales.ruta + 'php/monedas/get_monedas.php');
  }

  public getTiposCuenta() {
    return this.globales.TiposCuenta;
  }

  public limpiarString(modelo: any) {
    let tipo = typeof (modelo);

    switch (tipo) {
      case 'string':
        return modelo.trim();

      case 'object':
        let clean_model = modelo;
        for (const key in clean_model) {
          if (clean_model.hasOwnProperty(key)) {
            if (typeof (clean_model[key]) == 'string') {
              clean_model[key] = clean_model[key].trim();
            }
          }
        }
        return clean_model;

      default:
        break;
    }
  }

  public IsObjEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  public searchRiff() {
    this.globales.buscarRiff();
  }

  public searchCne() {
    this.globales.buscarCne();
  }

  public KeyboardOnlyNumbersAndDecimal($event: KeyboardEvent) {
    return $event.charCode >= 48 && $event.charCode <= 57;
  }

  FillEmptyValues(objRef: any, value: any = '') {
    let obj = objRef;
    for (const key in obj) {
      if (typeof (obj[key]) == 'string') {
        if (obj[key] == '' && typeof (value) == 'string') {
          obj[key] = value;
        } else {
          /* this._swalService.ShowMessage(['warning', 'Alerta', 'Se intenta ingresar un valor del tipo incorrecto en ' + key]); */
        }
      } else if (typeof (obj[key]) == 'number') {
        if (!obj[key] || obj[key] == null) {
          obj[key] = 0;
        }
      }
    }

    return obj;
  }

  BuildAniosConsulta(): void {
    let currentDate = new Date();

    let anioInicial = 2019;
    let currentYear = currentDate.getFullYear();

    for (let index = anioInicial; index <= currentYear; index++) {
      this.Anios.push(index);
    }
  }
}
