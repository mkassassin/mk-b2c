import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://localhost:3000/API/CommentAndAnswer/';


@Injectable()
export class CommentAndAnswerService {


  constructor( private http: Http) {  }

    private handleError (error: Response | any) {
        console.error('ApiService::handleError', error);
        return Observable.throw(error);
    }

    public HighlightsCommentAdd(data: any) {
        return this.http .post(API_URL + 'HighlightsCommentAdd' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public GetHighlightsComments(PostId: any, UserId: any): Observable<any> {
        return this.http .get(API_URL + 'GetHighlightsComments/' + PostId + '/' + UserId)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public QuestionsAnwerAdd(data: any) {
        return this.http .post(API_URL + 'QuestionsAnswerAdd' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

}
