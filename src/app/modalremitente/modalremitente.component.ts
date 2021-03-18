import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { RemitenteModel } from '../Modelos/RemitenteModel';
import { Observable } from 'rxjs';



import { SwalService } from '../services/swal.service';
import { ToastService } from '../services/toast.service';
import { GeneralService } from '../shared/services/general/general.service';
import { RemitenteService } from '../services/remitente.service';
import { AccionModalRemitente } from '../shared/Enums/AccionModalRemitente';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-modalremitente',
  templateUrl: './modalremitente.component.html',
  styleUrls: ['./modalremitente.component.scss',/*  '../../../style.scss' */]
})
export class ModalremitenteComponent implements OnInit, OnDestroy {

  @Input() AbrirModalEvent: Observable<any>;

  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();
  @Output() IncluirRemitenteEnGiro: EventEmitter<any> = new EventEmitter();
  @Output() CargarDatosRemitente: EventEmitter<object> = new EventEmitter();
  @Output() CargarDatosRemitenteTransferencia: EventEmitter<object> = new EventEmitter();

  @ViewChild('ModalRemitente') ModalRemitente: any;

  private suscripcion: any;
  private tipo_persona: string = '';
  public Editar: boolean = false;
  public accion: string = 'crear';
  public MensajeGuardar: string = 'Se dispone a guardar esta caja recaudo';
  public tipo:any = '';
  public RemitenteModel: RemitenteModel = new RemitenteModel();

  constructor(private _swalService: SwalService,
    private _remitenteService: RemitenteService,
    private _toastService: ToastService,
    private _generalService: GeneralService,
    private _login:LoginService
    ) { }

  ngOnInit() {
    this.suscripcion = this.AbrirModalEvent.subscribe((data: any) => {
      this.tipo = data.tipo;
      this.accion = data.accion;

  console.log('data.->>',data);
  
      if (data.id_remitente != "0" && data.accion == 'editar') {
        this.MensajeGuardar = 'Se dispone a actualizar este remitente';
        this.Editar = true;
        let p = { id_remitente: data.id_remitente };
        this._remitenteService.getRemitente(p).subscribe((d: any) => {
          if (d.codigo == 'success') {
            this.RemitenteModel = d.query_data;
            this.ModalRemitente.show();
          } else {

            this._swalService.ShowMessage(data);
          }

        });
      } else if (data.id_remitente != "0" && data.accion == 'editar desde giro') {
       
        
        this.MensajeGuardar = 'Se dispone a actualizar este remitente';
        this.Editar = true;
        this.tipo_persona = data.tipo;
        this.RemitenteModel.Tipo = data.tipo; 
        let p = { id_remitente: data.id_remitente ,tipo_persona:this.tipo_persona};
        this._remitenteService.getRemitenteGiro(p).subscribe((d: any) => {
          if (d.codigo == 'success') {
            this.RemitenteModel = d.query_data;
            this.ModalRemitente.show();
          } else {

            this._swalService.ShowMessage(data);
          }

        });
        
      } else if (data.id_remitente != "0" && data.accion == 'editar desde transferencia') {
        this.MensajeGuardar = 'Se dispone a actualizar este remitente';
        this.Editar = true;
        //this.tipo_persona = data.tipo;
        let p = { id_remitente: data.id_remitente };
        this._remitenteService.getRemitente(p).subscribe((d: any) => {
          if (d.codigo == 'success') {
            this.RemitenteModel = d.query_data;
            this.ModalRemitente.show();
          } else {

            this._swalService.ShowMessage(data);
          }

        });
      } else if (data.id_remitente != "0" && data.accion == 'crear desde giro') {
        console.clear()
        console.log(data,'guardando');
        
        if(data.tipo=='destinatario'){
      
          this.MensajeGuardar = 'Se dispone a guardar este destinatario';
        }else{
          
          this.MensajeGuardar = 'Se dispone a guardar este remitente';
                
        }
        //this.MensajeGuardar = 'Se dispone a guardar este remitente';
        this.Editar = false;
        this.tipo_persona = data.tipo; 
        this.RemitenteModel.Tipo = data.tipo; 
        this.RemitenteModel.Id_Transferencia_Remitente = data.id_remitente;
        this.ModalRemitente.show();

      } else if (data.id_remitente != "0" && data.accion == 'crear desde transferencia') {
        this.MensajeGuardar = 'Se dispone a guardar este remitente';
        this.Editar = false;
        //this.tipo_persona = data.tipo;
        this.RemitenteModel.Id_Transferencia_Remitente = data.id_remitente;
        
        this.RemitenteModel.Tipo = data.tipo;
        this.ModalRemitente.show();

      } else {
        this.MensajeGuardar = 'Se dispone a guardar este remitente';
        this.Editar = false;
        this.ModalRemitente.show();
      }
    });
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
    this.CerrarModal();
  }

 
  // GetRemitenteData(idRemitente:string){
  //   this._remitenteService.getRemitente(idRemitente).subscribe((data:any) => {
  //     if (data.codigo == 'success') {
  //       this.RemitenteModel = data.query_data;

  //     }else{

  //       this._swalService.ShowMessage(data);
  //       this.RemitenteModel = new RemitenteModel();
  //     }
  //   });
  // }

  GuardarRemitente() {
    if (!this.ValidateModelBeforeSubmit()) {
      return;
    }

    // console.log(this.RemitenteModel);  remitente.model.Id_Agente_Externo = 
    this.RemitenteModel.Id_Agente_Externo = this._login.user().Id_Agente_Externo
    let modelo = this._generalService.normalize(JSON.stringify(this.RemitenteModel));
    console.log('modelosave',modelo);
    
    let datos = new FormData();
    datos.append("modelo", modelo);

    if (this.Editar) {
      this._remitenteService.editRemitente(datos)
     /*    .catch(error => {
          this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        }) */
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            switch (this.accion) {
              case 'editar':
                this.ActualizarTabla.emit();
                break;

              case 'editar desde giro':

                let rem = { tipo: this.tipo_persona, model: this.RemitenteModel };
                this.CargarDatosRemitente.emit(rem);
                break;

              case AccionModalRemitente.Editar_Transferencia:
                // console.log("entro editar switch");
                let remitente = { model: this.RemitenteModel };
                this.CargarDatosRemitenteTransferencia.emit(remitente);
                break;

              default:
                break;
            }


            this._swalService.ShowMessage(['success', data.titulo, data.mensaje]);


            // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
            // this._toastService.ShowToast(toastObj);
            this.CerrarModal();
          } else {
            this._swalService.ShowMessage(data);
          }
        });
    } else {
      this._remitenteService.saveRemitente(datos)
      /*   .catch(error => {
          this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        }) */
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            switch (this.accion) {
        /*       case 'crear':
                this.ActualizarTabla.emit();
                break;

              case 'crear desde giro':
                let objRespuesta = { tipo: this.tipo_persona, model: this.RemitenteModel };
                this.IncluirRemitenteEnGiro.emit(objRespuesta);
                break; */

              case AccionModalRemitente.Crear_Transferencia:
                // console.log("entro crear switch");
                
                let remitente:any = { model: this.RemitenteModel };
                
              
               
                this.CargarDatosRemitenteTransferencia.emit(remitente);
                break;

              default:
                break;
            }

            this._swalService.ShowMessage(['success', data.titulo, data.mensaje]);

            // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
            // this._toastService.ShowToast(toastObj);
            this.CerrarModal();
          } else {
            this._swalService.ShowMessage(data);
          }
        });
    }

    // this._remitenteService.editRemitente(datos).subscribe((data: any) => {
    //   if (data.codigo == 'success') {
    //     let data = {tipo:this.tipo_persona, model:this.RemitenteModel};
    //     this.CargarDatosRemitente.emit(data);
    //     this.CerrarModal();
    //   }else{
    //     this._swalService.ShowMessage(data);
    //   }
    // });
  }

  ValidateModelBeforeSubmit() {
    if (this.RemitenteModel.Id_Transferencia_Remitente == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'El número de documento no puede estar vacio']);
      return false;
    }

    if (this.RemitenteModel.Nombre == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'El nombre no puede estar vacio']);
      return false;
    }

    if (this.RemitenteModel.Telefono == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'El telefono no puede estar vacio']);
      return false;
    }

    return true;
  }

  CerrarModal() {
    this.RemitenteModel = new RemitenteModel();
    this.ModalRemitente.hide();
  };

  handleError(error: Response) {
    return Observable.throw(error);
  }
}
