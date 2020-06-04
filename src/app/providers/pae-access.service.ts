import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PaeAccessService {
  public servicioEndpoint = 'https://www.dokoit.com/apps/paeaccess_web/apiv0_1/servicios';

  constructor(public http: HttpClient) { }
  verificarUsuario($dni): Promise<any> {
    let url: string = this.servicioEndpoint + '/verificarUsuario.php';
    
    let body = new FormData();

    body.append('dni', $dni);


    return this.http.post(url, body)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  crearUsuario(valorSituacionSalud, datosUsuario): Promise<any> {
    let url: string = this.servicioEndpoint + '/crearUsuario.php';
    
    let body = new FormData();

    body.append('valorSituacionSalud', valorSituacionSalud);
    body.append('datosUsuario', datosUsuario);


    return this.http.post(url, body)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }



  //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
  private extractData(res: Response) {
    //Convert the response to JSON format
    //console.log(res)
    // let body = res.json();
    //Return the data (or nothing)
    return res || {};
  }

  //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
  private handleError(res: Response | any) {
    return Promise.reject(res.message || res);
  }
}
