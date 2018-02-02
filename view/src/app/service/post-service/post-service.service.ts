import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://139.59.20.129:80/API/';

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

    public GetHighlightsList(UserId: any, Limit:any): Observable<any[]> {
        return this.http .get(API_URL + 'HighlightsPost/GetPostList/'+ UserId + "/"+ Limit)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }


    public QuestionsSubmit(data: any) {
        return this.http .post(API_URL + 'QuestionsPost/Submit' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public GetQuestionsList(UserId: any, Limit:any): Observable<any[]> {
        return this.http .get(API_URL + 'QuestionsPost/GetPostList/'+ UserId + "/"+ Limit)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }


}
