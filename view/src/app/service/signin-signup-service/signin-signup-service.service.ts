import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://139.59.20.129:80/API/SignInSignUp/';

@Injectable()
export class SigninSignupServiceService {
    

  constructor( private http: Http) {  }

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
        return this.http .get(API_URL + 'UserValidate/' + email + "/" + password)
        .map(response => { 
                        const result = response.json();
                            if (result.status == "True" && result.data._id) {
                                let encodedata = btoa(Date());
                                localStorage.setItem('UserToken', btoa(Date()));
                                localStorage.setItem('currentUser', JSON.stringify(result));
                            }else{
                                localStorage.removeItem('currentUser');
                            }
                        return result; 
                    }) .catch(this.handleError);
    }


    public Register(data: any) {
        return this.http .post(API_URL + 'Register' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    // public GetCountries(): Observable<any[]>  {
    //     return this.http .get("https://battuta.medunes.net/api/country/all/?key=e25aa18a44446a410802dac50fe6fcc7")
    //     .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    // }

    // public GetStates(CountyCode: any): Observable<any[]>  {
    //     return this.http .get("https://battuta.medunes.net/api/region/"+ CountyCode +"/all/?key=e25aa18a44446a410802dac50fe6fcc7")
    //     .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    // }

    // public GetCities(CountyCode: any, StateName: any): Observable<any[]>  {
    //     return this.http .get("https://battuta.medunes.net/api/city/"+ CountyCode +"/search/?region="+ StateName +"?key=e25aa18a44446a410802dac50fe6fcc7")
    //     .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    // }


}
