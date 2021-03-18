import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AgentesExternosComponent } from './agentes-externos/agentes-externos.component';
import { APP_ROUTES } from './routes';
import { AuthGuard } from './auth.guard';
import { PagadosComponent } from './agentes-externos/pagados/pagados.component';
import { Globales } from './shared/globales/globales';
import { GeneralService } from './shared/services/general/general.service';

import { registerLocaleData, DatePipe } from '@angular/common';
import { TablatransferenciascajeroComponent } from './tablatransferenciascajero/tablatransferenciascajero.component';
import { ModalBasicComponent } from './shared/modal-basic/modal-basic.component';
import { ModaldetallerecibotransferenciaComponent } from './modaldetallerecibotransferencia/modaldetallerecibotransferencia.component';

import { NgxPaginationModule } from 'ngx-pagination'; //
import { MonedaService } from './services/moneda.service';
import { DestinatarioService } from './services/destinatario.service';
import { ToastService } from './services/toast.service';
import { TransferenciaService } from './services/transferencia.service';
import { SwalService } from './services/swal.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { PermisoService } from './services/permiso.service';
import { NgxCurrencyModule } from 'ngx-currency';

import { DestinatarioModel } from './Modelos/DestinatarioModel';
import { BancoService } from './services/banco.service';
import { TipodocumentoService } from './services/tipodocumento.service';
import { ValidacionService } from './services/validacion.service';
import { ModaldestinatarioComponent } from './modaldestinatario/modaldestinatario.component';
import { ColorsaldoDirective } from './common/CustomAtributeDirectives/colorsaldo.directive';
import { SafePipe } from './common/Pipes/safe.pipe';
import { PuntosPipe } from './common/Pipes/puntos.pipe';
import { CustomcurrencyPipe } from './common/Pipes/customcurrency.pipe';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';
import { CommonLayoutComponent } from './common/common-layout.component';
import { ModalremitenteComponent } from './modalremitente/modalremitente.component';
import { RemitenteService } from './services/remitente.service';
import { CupoComponent } from './cupo/cupo.component';
import { CupoAgente } from './services/cupo-agente.service';

export const customCurrencyMaskConfig = {
  align: 'left',
  allowNegative: true,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
  nullable: true,
  min: null,
  max: null,
  // inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  declarations: [
    ColorsaldoDirective,
    SafePipe,
    CustomcurrencyPipe,
    PuntosPipe,
    AuthenticationLayoutComponent,
    CommonLayoutComponent,
    AppComponent,
    LoginComponent,
    AgentesExternosComponent,
    PagadosComponent,
    TablatransferenciascajeroComponent,
    ModalBasicComponent,
    ModaldetallerecibotransferenciaComponent,
    ModaldestinatarioComponent,
    CommonLayoutComponent,
    ModalremitenteComponent,
    CupoComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-outline-primary btn-rounded',
      cancelButtonClass: 'btn btn-danger btn-rounded',
      timer: 5000,
    }),
    NgxMaskModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    APP_ROUTES,
    NgxPaginationModule,
    NgbModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
  exports: [
    ModalBasicComponent
],
  providers: [
    RemitenteService,
    AuthGuard,
    GeneralService,
    Globales,
    DatePipe,
    MonedaService,
    DestinatarioService,
    ToastService,
    TransferenciaService,
    SwalService,
    PermisoService,
    DestinatarioModel,
    BancoService,
    TipodocumentoService,
    ValidacionService,
    CupoAgente
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
