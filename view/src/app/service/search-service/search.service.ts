import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://localhost:3000/API/Search/';


@Injectable()
export class SearchService {


  constructor( private http: Http) {  }

    private handleError (error: Response | any) {
        console.error('ApiService::handleError', error);
        return Observable.throw(error);
    }

  public Users(UserId: any): Observable<any[]> {
      return this.http.get(API_URL + 'Users/' + UserId )
      .map(response => { const datas = response.json(); return datas; })
      .catch(this.handleError);
  }
  public Topics(UserId: any): Observable<any[]> {
      return this.http.get(API_URL + 'Topics/' + UserId )
      .map(response => { const datas = response.json(); return datas; })
      .catch(this.handleError);
  }

}
