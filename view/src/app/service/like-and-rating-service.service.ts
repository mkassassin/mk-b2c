import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://localhost:3000/API/LikeAndRating/';

@Injectable()
export class LikeAndRatingServiceService {


  constructor( private http: Http) {  }

    private handleError (error: Response | any) {
        console.error('ApiService::handleError', error);
        return Observable.throw(error);
    }

    public HighlightsLikeAdd(data: any) {
        return this.http .post(API_URL + 'HighlightsLikeAdd' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public HighlightsUnLike(LikeId: any): Observable<any[]> {
        return this.http.get(API_URL + 'HighlightsUnLike/' + LikeId )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public CommentsLikeAdd(data: any) {
        return this.http .post(API_URL + 'CommentsLikeAdd' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public CommentsUnLike(LikeId: any): Observable<any[]> {
        return this.http.get(API_URL + 'CommentsUnLike/' + LikeId )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }



    public QuestionsRatingAdd(data: any) {
        return this.http .post(API_URL + 'QuestionsRatingAdd' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public AnswerRatingAdd(data: any) {
        return this.http .post(API_URL + 'AnswerRatingAdd' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }


    public Category4TopicPostRatingAdd(data: any) {
        return this.http .post(API_URL + 'Category4TopicPostRatingAdd' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }


    public Category4TopicCommentsLikeAdd(data: any) {
        return this.http .post(API_URL + 'Category4TopicCommentsLikeAdd' , data)
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public Category4TopicCommentsUnLike(LikeId: any): Observable<any[]> {
        return this.http.get(API_URL + 'Category4TopicCommentsUnLike/' + LikeId )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

}
