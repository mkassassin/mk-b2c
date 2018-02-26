import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://localhost:3000/API/';

@Injectable()
export class PostServiceService {

  constructor( private http: Http) {  }

  private handleError (error: Response | any) {
      console.error('ApiService::handleError', error);
      return Observable.throw(error);
  }

    public HighlightsSubmit(data: any) {
        return this.http .post(API_URL + 'HighlightsPost/Submit' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }
    public HighlightsUpdate(data: any) {
        return this.http .post(API_URL + 'HighlightsPost/Update' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }
    public HighlightsPostShare(data: any) {
        return this.http .post(API_URL + 'HighlightsPost/SharePost' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }
    public HighlightsFBPostShare(data: any) {
        return this.http .post(API_URL + 'HighlightsPost/FacebookSharePost' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public GetHighlightsList(UserId: any, Limit: any): Observable<any[]> {
        return this.http .get(API_URL + 'HighlightsPost/GetPostList/' + UserId + '/' + Limit)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ViewHighlightPost(UserId: any, PostId: any): Observable<any[]> {
        return this.http .get(API_URL + 'HighlightsPost/ViewPost/' + UserId + '/' + PostId)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }


    public QuestionsSubmit(data: any) {
        return this.http .post(API_URL + 'QuestionsPost/Submit' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public QuestionsUpdate(data: any) {
        return this.http .post(API_URL + 'QuestionsPost/Update' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public QuestionsPostShare(data: any) {
        return this.http .post(API_URL + 'QuestionsPost/SharePost' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public QuestionsFBPostShare(data: any) {
        return this.http .post(API_URL + 'QuestionsPost/FacebookSharePost' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public GetQuestionsList(UserId: any, Limit: any): Observable<any[]> {
        return this.http .get(API_URL + 'QuestionsPost/GetPostList/' + UserId + '/' + Limit)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ViewQuestionsPost(UserId: any, PostId: any): Observable<any[]> {
        return this.http .get(API_URL + 'QuestionsPost/ViewPost/' + UserId + '/' + PostId)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }


    public GetTopicQuestionsList(UserId: any, Limit: any, TopicId: any): Observable<any[]> {
        return this.http .get(API_URL + 'QuestionsPost/GetTopicPostList/' + UserId + '/' + Limit + '/' + TopicId)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

}
