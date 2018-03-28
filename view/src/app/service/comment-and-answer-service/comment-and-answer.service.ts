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
    public CommentUpdate(data: any) {
        return this.http .post(API_URL + 'CommentUpdate' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }
    public GetHighlightsComments(PostId: any, UserId: any): Observable<any> {
        return this.http .get(API_URL + 'GetHighlightsComments/' + PostId + '/' + UserId)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }
    public GetHighlightsAllComments(PostId: any, UserId: any): Observable<any> {
        return this.http .get(API_URL + 'GetHighlightsAllComments/' + PostId + '/' + UserId)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }



    public QuestionsAnswerAdd(data: any) {
        return this.http .post(API_URL + 'QuestionsAnswerAdd' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }
    public AnswerUpdate(data: any) {
        return this.http .post(API_URL + 'AnswerUpdate' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }
    public GetQuestionsAnswers(PostId: any, UserId: any): Observable<any> {
        return this.http .get(API_URL + 'GetQuestionsAnswers/' + PostId + '/' + UserId)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }
    public GetQuestionsAllAnswers(PostId: any, UserId: any): Observable<any> {
        return this.http .get(API_URL + 'GetQuestionsAllAnswers/' + PostId + '/' + UserId)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }



    public Category4TopicCommentAdd(data: any): Observable<any[]> {
        return this.http .post(API_URL + 'Category4TopicCommentAdd', data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public Category4TopicCommentList(PostId: any, UserId: any): Observable<any[]> {
        return this.http .get(API_URL + 'Category4TopicCommentList/' + PostId + '/' + UserId )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public Category4TopicAllCommentList(PostId: any, UserId: any): Observable<any[]> {
        return this.http .get(API_URL + 'Category4TopicAllCommentList/' + PostId + '/' + UserId )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public Category4TopicCommentUpdate(data: any): Observable<any[]> {
        return this.http .post(API_URL + 'Category4TopicCommentUpdate', data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

}
