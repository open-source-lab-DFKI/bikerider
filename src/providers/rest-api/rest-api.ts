
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';

/*
  Generated class for the RestApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestApiProvider {
  apiUrl = 'http://lnv-3246.sb.dfki.de:3001/bikerider/v1';
  constructor(public http: HttpClient) {
    console.log('Hello RestApiProvider Provider');
  }
  getUsersPositions() {
    return new Promise(resolve => {
      let myHeaders = new HttpHeaders();
   
    const options ={
      headers: new HttpHeaders().set('Authorization', 'Basic YXBwX3VzZXI6VzBCLGtIcGpGO1hcdH5pUzZ8Z0N1Tw'),
      params: new HttpParams().set('Userid', '3'),
    }
      this.http.get(this.apiUrl+'/users').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
