import { Component, Directive, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable, Subscription, pipe } from 'rxjs';
import { NgForm } from '../../../node_modules/@angular/forms';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';

import { SwalService } from '../services/swal.service';
import { ToastService } from '../services/toast.service';
import { GeneralService } from '../shared/services/general/general.service';
import { tap } from 'rxjs/operators';
import { NotificacionsService } from '../services/notificacions.service';
//import '../../styles.scss';
/* import './common-layout.component.scss'; */


@Component({
    selector: 'app-dashboard',
    templateUrl: './common-layout.component.html',
    styleUrls: ['./common-layout.component.scss'],
  /*   encapsulation: ViewEncapsulation.None, */
    providers: [ NotificacionsService, ]

})

export class CommonLayoutComponent implements OnInit {

    public mostrarDatos: boolean = true;
    public CargandoLabels: Array<any> = [
        'Cargando Monedas',
        'Cargando Oficinas',
        'Cargando Cajas',
        'Cargando Saldos',
        'Cargando Impresoras',
        'Cargando Mac',
        'Cargando Listas Generales'
    ]
    public fraseCargando: any = 'Cargando Datos';
    public app: any;
    public headerThemes: any;
    public changeHeader: any;
    public sidenavThemes: any;
    public changeSidenav: any;
    public headerSelected: any;
    public sidenavSelected: any;
    public searchActived: any;
    public searchModel: any;
    public user: any = JSON.parse(localStorage.getItem('User'));
    public changePasswordMessage: string;
    public alertas: any = [];
    public alertasCajas: any = [];
    public contadorTraslado = 0;
    public cierreCajaCambioIngreso = [];
    public cierreCajaCambioEgreso = [];
    public SaldoInicialPeso: number = 0;
    SumaIngresosPesos: number = 0;
    SumaIngresosBolivar: number = 0;
    SumaEgresosPesos: number = 0;
    SumaEgresosBolivar: number = 0;
    EntregadoIngresosPesos: number = 0;
    EntregadoIngresosBolivares: number = 0;
    EntregadoEgresosBolivares: number = 0;
    TotalTraslados: any
    public Modulos: Array<string> = ['Cambios', 'Transferencias', 'Giros', 'Traslados', 'Corresponsal', 'Servicios', 'Egresos'];

    @ViewChild('confirmSwal') confirmSwal: any;
    @ViewChild('ModalCambiarContrasena') ModalCambiarContrasena: any;
    @ViewChild('CierreCaja') CierreCaja: any;
    @ViewChild('errorSwal') errorSwal: any;
    @ViewChild('ModalCambiarBanco') ModalCambiarBanco: any;
    @ViewChild('mensajeSwal') mensajeSwal: any;
    @ViewChild('macSwal') macSwal: any;
    @ViewChild('ModalResumenCuenta') ModalResumenCuenta: any;
    @ViewChild('ModalCierreCuentaBancaria') ModalCierreCuentaBancaria: any;
    @ViewChild('ModalAjuste') ModalAjuste: any;
    @ViewChild('alertSwal') alertSwal: any;

    @ViewChild('modalOficinaCaja') modalOficinaCaja: any;
    @ViewChild('ModalAperturaCaja') ModalAperturaCaja: any;

    cajero = true;

    ticks = 0;

    minutesDisplay: number = 0;
    hoursDisplay: number = 0;
    secondsDisplay: number = 0;

    sub: Subscription;
    myDate: Date;

    CambiosIngresos: any = [];
    TransferenciaIngresos: any = [];
    GiroIngresos: any = [];
    TrasladoIngresos: any = [];
    CorresponsalIngresos: any = [];
    ServicioIngresos: any = [];
    CambiosEgresos: any = [];
    GiroEgresos: any = [];
    TrasladoEgresos: any = [];

    ingresoCambio: any = 0;
    ingresoTransferencia: any = 0;
    ingresoGiro: any = 0;
    ingresoTraslado: any = 0;
    ingresoCorresponsal: any = 0;
    ingresoServicio: any = 0;

    egresoCambio: any = 0;
    egresoGiro: any = 0;
    egresoTraslado: any = 0;

    public counter = '0';

    //VARIABLES NUEVA
    public Oficinas: any = [];
    public Cajas: any = [];
    public oficina_seleccionada: any = '';
    public caja_seleccionada: any = '';

    public Paises: any = [];

    public AperturaCuentaModel: any = {
        Id_Cuenta_Bancaria: '',
        Id_Moneda: '',
        Valor: '',
        Id_Bloqueo_Cuenta: ''
    };

    fajosPesos = [
        { "BilleteEntero100": 50000, "ValorEntero100": 0, "BilleteEntero50": 50000, "ValorEntero50": 0, "BilleteSuelto": 50000, "ValorSuelto": 0, "Moneda": "Pesos" },
        { "BilleteEntero100": 20000, "ValorEntero100": 0, "BilleteEntero50": 20000, "ValorEntero50": 0, "BilleteSuelto": 20000, "ValorSuelto": 0, "Moneda": "Pesos" },
        { "BilleteEntero100": 10000, "ValorEntero100": 0, "BilleteEntero50": 10000, "ValorEntero50": 0, "BilleteSuelto": 10000, "ValorSuelto": 0, "Moneda": "Pesos" },
        { "BilleteEntero100": 5000, "ValorEntero100": 0, "BilleteEntero50": 5000, "ValorEntero50": 0, "BilleteSuelto": 5000, "ValorSuelto": 0, "Moneda": "Pesos" },
        { "BilleteEntero100": 2000, "ValorEntero100": 0, "BilleteEntero50": 2000, "ValorEntero50": 0, "BilleteSuelto": 2000, "ValorSuelto": 0, "Moneda": "Pesos" },
        { "BilleteEntero100": 1000, "ValorEntero100": 0, "BilleteEntero50": 1000, "ValorEntero50": 0, "BilleteSuelto": 1000, "ValorSuelto": 0, "Moneda": "Pesos" }
    ]

    fajosBolivares = [
        { "BilleteEntero100": 500, "ValorEntero100": 0, "BilleteEntero50": 500, "ValorEntero50": 0, "BilleteSuelto": 500, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 200, "ValorEntero100": 0, "BilleteEntero50": 200, "ValorEntero50": 0, "BilleteSuelto": 200, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 100, "ValorEntero100": 0, "BilleteEntero50": 100, "ValorEntero50": 0, "BilleteSuelto": 100, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 50, "ValorEntero100": 0, "BilleteEntero50": 50, "ValorEntero50": 0, "BilleteSuelto": 50, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 20, "ValorEntero100": 0, "BilleteEntero50": 20, "ValorEntero50": 0, "BilleteSuelto": 20, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 10, "ValorEntero100": 0, "BilleteEntero50": 10, "ValorEntero50": 0, "BilleteSuelto": 10, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 5, "ValorEntero100": 0, "BilleteEntero50": 5, "ValorEntero50": 0, "BilleteSuelto": 5, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 2, "ValorEntero100": 0, "BilleteEntero50": 2, "ValorEntero50": 0, "BilleteSuelto": 2, "ValorSuelto": 0, "Moneda": "Bolivares" }
    ]

    //NUEVO CODIGO

    public MostrarToasty: boolean = false;

    //#region APERTURA CAJA

    public MonedasSistema: any = [];

    public DiarioModel: any = {
        Id_Diario: '',
        Id_Funcionario: this.user.Identificacion_Funcionario,
        Caja_Apertura: this.caja_seleccionada,
        Oficina_Apertura: this.oficina_seleccionada
    };

    public ValoresMonedasApertura: any = [
        { Id_Moneda: '', Valor_Moneda_Apertura: '', NombreMoneda: '', Codigo: '' }
    ];

    public NombreCaja: string = '';
    public NombreOficina: string = '';


    constructor(private router: Router,
        private activeRoute: ActivatedRoute,
        private http: HttpClient,
        private globales: Globales,

        private swalService: SwalService,
        /* private _notificacionService: NotificacionsService , */
    
        private _generalService: GeneralService ) {


     /*    this.Cargar(); */

      /*   this._notificacionService.counter(); */
       /*  this._notificacionService.notifcaciones$.subscribe((data: any) => this.counter = data)

 */
        this.app = {
            layout: {
                sidePanelOpen: false,
                isMenuOpened: false,
                isMenuCollapsed: true,
                themeConfigOpen: false,
                rtlActived: false,
                searchActived: false
            }
        };


        this.headerThemes = ['header-default', 'header-primary', 'header-info', 'header-success', 'header-danger', 'header-dark'];
        this.changeHeader = changeHeader;

        function changeHeader(headerTheme) {
            this.headerSelected = headerTheme;
        }

        this.sidenavThemes = ['sidenav-default', 'side-nav-dark'];
        this.changeSidenav = changeSidenav;

        function changeSidenav(sidenavTheme) {
            this.sidenavSelected = sidenavTheme;
        }

        this.AsignarPaises();
        this.AsignarMonedas();
        this.AsignarMonedasApertura();
      

        if (!localStorage.getItem('Volver_Apertura')) {
            localStorage.setItem("Volver_Apertura", "Si");
        }

    }


    startTimer() {
        setInterval(() => {
            this.myDate = new Date();
        }, 1000);
    }

    OcultarCajero = false;
    OcultarConsultor = true;
    ListaBancos = [];
    nombreBanco = "";

    timer = ms => new Promise(res => setTimeout(res, ms))

   /*  async Cargar() {
        for (var i = 0; i < this.CargandoLabels.length; i++) {
            await this.timer(1500); // then the created Promise can be awaited
            this.fraseCargando = this.CargandoLabels[i];
            if (i == this.CargandoLabels.length - 1) {
                i = 0;
            }
        }
    } */
    async ngOnInit() {

        this.swalService.event.subscribe((data: any) => {
            this.ShowSwal(data.type, data.title, data.msg);
        });


   /*      this.http.get(this.globales.ruta + 'php/sesion/alerta.php', { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.alertas = data;
        }); */

        this.startTimer();

      
    }



    salir() {

        
        localStorage.clear();

        setTimeout(() => {
            this.router.navigate(["/login"]);
        }, 800);
    }

    private _registrarCierreSesion() {
        let data = new FormData();
        data.append('id_funcionario', this._generalService.Funcionario.Identificacion_Funcionario);
       // dd this._funcionarioService.LogCierreSesion(data).subscribe();
    }

    ValidateConsultorBeforeLogout() {
        let funcionario = JSON.parse(localStorage['User']);

        if (funcionario.Id_Perfil == '4') {

            let cuenta = localStorage.getItem('CuentaConsultor');

            if (cuenta != '') {
                this.ShowSwal('warning', 'Cuenta Abierta', 'Debe cerrar la cuenta en la que opera antes de cerrar la sesión!');
                return false;
            }
        }

        return true;
    }


    CambiarContrasena(formulario: NgForm, modal) {
        let datos = new FormData();
        datos.append("clave", formulario.value.clave);
        datos.append("user", this.user.Identificacion_Funcionario);
        this.http.post(this.globales.ruta + 'php/funcionarios/cambia_clave.php', datos).subscribe((data: any) => {
            this.changePasswordMessage = data.Mensaje;
            formulario.reset();
            this.ModalCambiarContrasena.hide();
            this.confirmSwal.show();
        });
    }





    abrirModal() {
        this.ModalAjuste.show();
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hoy = yyyy + '-' + mm + '-' + dd;
        (document.getElementById("datefield") as HTMLInputElement).setAttribute("max", hoy);
    }


    SaldoInicialBanco = 0;
    IdBanco = 0;
    VerificarSaldo(value) {
        if (value == '') {
            this.AperturaCuentaModel.Valor = '';
            this.AperturaCuentaModel.Id_Cuenta_Bancaria = value;
            this.AperturaCuentaModel.Id_Moneda = '';
            return;
        }

        this.IdBanco = value;
        var index = this.ListaBancos.findIndex(x => x.Id_Cuenta_Bancaria === value);
        if (index > -1) {
            this.SaldoInicialBanco = this.ListaBancos[index].Valor;
            this.AperturaCuentaModel.Id_Moneda = this.ListaBancos[index].Id_Moneda;
            this.AperturaCuentaModel.Id_Cuenta_Bancaria = value;
            this.AperturaCuentaModel.Valor = this.ListaBancos[index].Valor;
            //GuardarInicio
        }
    }


    //FUNCIONES NUEVAS

    AsignarMonedas() {
        this.MonedasSistema = this.globales.Monedas;
    }

    AsignarMonedasApertura() {
        if (this.MonedasSistema.length > 0) {

            this.ValoresMonedasApertura = [];
            this.MonedasSistema.forEach(moneda => {
                let monObj = { Id_Moneda: moneda.Id_Moneda, Valor_Moneda_Apertura: '', NombreMoneda: moneda.Nombre, Codigo: moneda.Codigo };
                this.ValoresMonedasApertura.push(monObj);
            });
        }
    }

   
    async AsignarPaises() {
        this.Paises = await this.globales.Paises;
    }


    ShowSwal(tipo: string, titulo: string, msg: string) {
        this.alertSwal.type = tipo;
        this.alertSwal.title = titulo;
        this.alertSwal.text = msg;
        this.alertSwal.show();
    }

  
  

    CargarBancosPais(id_pais) {
        if (id_pais == '') {
            this.LimpiarModeloCuentaBancaria();
            this.ListaBancos = [];
            return;
        }

        this.http.get(this.globales.ruta + 'php/bancos/lista_bancos_por_pais.php', { params: { id_pais: id_pais } }).subscribe((data: any) => {
            this.ListaBancos = data;
        });
    }

    LimpiarModeloCuentaBancaria() {
        this.AperturaCuentaModel = {
            Id_Cuenta_Bancaria: '',
            Id_Moneda: '',
            Valor: '',
            Id_Bloqueo_Cuenta: ''
        };
    }



}
