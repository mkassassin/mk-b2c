import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://localhost:3000/API/Trends/';

@Injectable()
export class TrendsService {


  constructor( private http: Http) {  }

    private handleError (error: Response | any) {
        console.error('ApiService::handleError', error);
        return Observable.throw(error);
    }


    public CoinsList(LikeId: any): Observable<any[]> {
        return this.http.get(API_URL + 'CoinsList' )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ImpressionAdd(data: any) {
        return this.http.post(API_URL + 'ImpressionAdd', data )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ImpressionPosts(CoinId: any): Observable<any[]> {
        return this.http.get(API_URL + 'ImpressionPosts/'+ CoinId )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }

    public ChartInfo(CoinCode: any): Observable<any[]> {
        return this.http.get(API_URL + 'ChartInfo/' + CoinCode )
        .map(response => { const datas = response.json(); return datas; })
        .catch(this.handleError);
    }


}
