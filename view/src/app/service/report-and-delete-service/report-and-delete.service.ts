import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://localhost:3000/API/ReportAndDelete/';

@Injectable()
export class ReportAndDeleteService {

  constructor( private http: Http) {  }

    private handleError (error: Response | any) {
        console.error('ApiService::handleError', error);
        return Observable.throw(error);
    }

    public ReportUser(data: any) {
        return this.http.post(API_URL + 'ReportUser', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ReportUserValidate(data: any) {
        return this.http.post(API_URL + 'ReportUserValidate', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ReportPost(data: any) {
        return this.http.post(API_URL + 'ReportPost', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ReportPostValidate(data: any) {
        return this.http.post(API_URL + 'ReportPostValidate', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ReportSecondLevelPost(data: any) {
        return this.http.post(API_URL + 'ReportSecondLevelPost', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ReportSecondLevelPostValidate(data: any) {
        return this.http.post(API_URL + 'ReportSecondLevelPostValidate', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public DeleteHighlightPost(data: any) {
        return this.http.post(API_URL + 'DeleteHighlightPost', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public DeleteQuestionPost(data: any) {
        return this.http.post(API_URL + 'DeleteQuestionPost', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public DeleteComment(data: any) {
        return this.http.post(API_URL + 'DeleteComment', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public DeleteAnswer(data: any) {
        return this.http.post(API_URL + 'DeleteAnswer', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public DeleteImpression(data: any) {
        return this.http.post(API_URL + 'DeleteImpression', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

}
