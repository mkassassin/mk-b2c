import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://localhost:3000/API/';

@Injectable()
export class SigninSignupServiceService {

  constructor( private http: Http ) {  }

  private handleError (error: Response | any) {
      console.error('ApiService::handleError', error);
      return Observable.throw(error);
  }

  public NameValidate(name: any): Observable<any[]>  {
      return this.http .get(API_URL + 'NameValidate/' + name)
      .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
  }

  public EmailValidate(email: any): Observable<any[]>  {
      return this.http .get(API_URL + 'EmailValidate/' + email)
      .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
  }

  public UserValidate(email: any,password: any): Observable<any[]>  {
      return this.http .get(API_URL + 'UserValidate/' + email + "/ " + password)
      .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
  }

  public Register(data: any) {
      return this.http .post(API_URL + 'Register' , data)
      .map(response => { const datas = response.json(); return datas; })
      .catch(this.handleError);
  }


}
