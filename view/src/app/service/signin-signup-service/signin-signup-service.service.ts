import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://localhost:3000/API/SignInSignUp/';

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

    public UserValidate(email: any, password: any): Observable<any[]>  {
        return this.http .get(API_URL + 'UserValidate/' + email + '/' + password)
        .map(response => {
                        const result = response.json();
                            if (result.status === 'True' && result.data._id) {
                                const encodedata = btoa(Date());
                                localStorage.setItem('UserToken', btoa(Date()));
                                localStorage.setItem('currentUser', JSON.stringify(result));
                            }else {
                                localStorage.removeItem('currentUser');
                            }
                        return result;
                    }) .catch(this.handleError);
    }

    public FBUserValidate(email: any, fbid: any): Observable<any[]>  {
        return this.http .get(API_URL + 'FBUserValidate/' + email + '/' + fbid)
        .map(response => {
                        const result = response.json();
                            if (result.status === 'True' && result.data._id) {
                                const encodedata = btoa(Date());
                                localStorage.setItem('UserToken', btoa(Date()));
                                localStorage.setItem('currentUser', JSON.stringify(result));
                            }else {
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

    public SendFPVerifyEmail(email: any) {
        return this.http .get(API_URL + 'SendFPVerifyEmail/' + email)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public NewPasswordEmailValidate(email: any, token: any) {
        return this.http .get(API_URL + 'NewPasswordEmailValidate/' + email + '/' + token)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public UpdatePassword( data: any) {
        return this.http .post(API_URL + 'UpdatePassword', data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public PrivacyUpdate( data: any) {
        return this.http .post(API_URL + 'PrivacyUpdate', data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ChangePassword( data: any) {
        return this.http .post(API_URL + 'ChangePassword', data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ProfileUpdate( data: any) {
        return this.http .post(API_URL + 'ProfileUpdate', data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public UserInfo(UserId: any): Observable<any[]>  {
        return this.http .get(API_URL + 'UserInfo/' + UserId )
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }

    public GetUserInfo(UserId: any, LoginUserId: any): Observable<any[]>  {
        return this.http .get(API_URL + 'GetUserInfo/' + UserId + '/' + LoginUserId)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }

    public GetNotification(UserId: any): Observable<any[]>  {
        return this.http .get(API_URL + 'GetNotification/' + UserId)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }

    public RemoveNotification(NotifyId: any): Observable<any[]>  {
        return this.http .get(API_URL + 'RemoveNotification/' + NotifyId)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }

}
