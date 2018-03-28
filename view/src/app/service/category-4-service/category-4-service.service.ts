import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://localhost:3000/API/';

@Injectable()
export class Category4ServiceService {

    constructor( private http: Http) {  }

    private handleError (error: Response | any) {
        console.error('ApiService::handleError', error);
        return Observable.throw(error);
    }

    public Category4TopicNameValidate(Name: any): Observable<any[]> {
        return this.http .get(API_URL + 'Category4Topics/Category4TopicNameValidate/' + Name)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public AllCategory4Topics(): Observable<any[]> {
        return this.http .get(API_URL + 'Category4Topics/AllCategory4Topics')
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public Category4TopicPostSubmit(data: any): Observable<any[]> {
        return this.http .post(API_URL + 'Category4Topics/Category4TopicPostSubmit', data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public Category4TopicPostUpdate(data: any): Observable<any[]> {
        return this.http .post(API_URL + 'Category4Topics/Category4TopicPostUpdate', data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public Category4TopicPostList(TopicId: any, PostType: any, UserId: any, Limit: any): Observable<any[]> {
        return this.http .get(API_URL + 'Category4Topics/Category4TopicPostList/' + TopicId + '/' + PostType + '/' + UserId + '/' + Limit)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }
}
