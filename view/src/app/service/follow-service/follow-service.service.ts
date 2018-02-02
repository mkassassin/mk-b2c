import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://139.59.20.129:80/API/Follow/';

@Injectable()
export class FollowServiceService {
  constructor( private http: Http) {  }

  private handleError (error: Response | any) {
      console.error('ApiService::handleError', error);
      return Observable.throw(error);
  }

    public UnFollowingUsers(Id: any, catId: any): Observable<any[]>  {
        return this.http.get(API_URL + 'UnFollowingUsers/' + Id + "/" + catId)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }

    public UnFollowingTopics(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'UnFollowingTopics/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }

    public FollowingUsers(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'FollowingUsers/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }

    public FollowingTopics(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'FollowingTopics/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }

    public UserFollowingUsers(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'UserFollowingUsers/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }

    public FollowUser(data: any) {
        return this.http.post(API_URL + 'FollowUser' , data)
        .map(response => { const datas = response.json(); return datas; }).catch(this.handleError);
    }

    public FollowTopic(data: any) {
      return this.http.post(API_URL + 'FollowTopic' , data)
      .map(response => { const datas = response.json(); return datas; }).catch(this.handleError);
    }

    public UnFollowUser(Id: any): Observable<any[]>  {
      return this.http.delete(API_URL + 'UnFollowUser/' + Id)
      .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }

    public UnFollowTopic(Id: any): Observable<any[]>  {
        return this.http.delete(API_URL + 'UnFollowTopic/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
}
