import { Injectable } from '@angular/core';
import { promise } from 'selenium-webdriver';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 

  constructor( public http : HttpClient , public _globales : Globales) {
    
  }

  user(){
  
     return JSON.parse(localStorage.getItem('User'));       

  }
  
  isLoggedIn(){ return this.user() != null ? true : false }
  login( username , password ){
    let params  = new FormData();
    params.append('username',username);
    params.append('password',password);

    return this.http.post( this._globales.ruta + 'php/sesion/validate_agente_externo.php',params)
  }

  logOut(){
    localStorage.clear()
  }
}
