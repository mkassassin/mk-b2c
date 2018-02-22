import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = 'http://localhost:3000/API/Follow/';

@Injectable()
export class FollowServiceService {
  constructor( private http: Http) {  }

  private handleError (error: Response | any) {
      console.error('ApiService::handleError', error);
      return Observable.throw(error);
  }

    public FollowUser(data: any) {
        return this.http.post(API_URL + 'FollowUser' , data)
        .map(response => { const datas = response.json(); return datas; }).catch(this.handleError);
    }
    public UnFollowUser(Id: any): Observable<any[]>  {
        return this.http.delete(API_URL + 'UnFollowUser/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public FollowingUsers(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'FollowingUsers/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public AllFollowingUsers(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'AllFollowingUsers/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public UserFollowingUsers(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'UserFollowingUsers/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public AllUserFollowingUsers(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'AllUserFollowingUsers/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public UnFollowingUsers(Id: any, catId: any): Observable<any[]>  {
        return this.http.get(API_URL + 'UnFollowingUsers/' + Id + '/' + catId)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public AllUnFollowingUsers(Id: any, catId: any): Observable<any[]>  {
        return this.http.get(API_URL + 'AllUnFollowingUsers/' + Id + '/' + catId)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }




    public FollowTopic(data: any) {
        return this.http.post(API_URL + 'FollowTopic' , data)
        .map(response => { const datas = response.json(); return datas; }).catch(this.handleError);
    }
    public UnFollowTopic(Id: any): Observable<any[]>  {
        return this.http.delete(API_URL + 'UnFollowTopic/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public DiscoverTopics(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'DiscoverTopics/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public FollowingTopics(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'FollowingTopics/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public AllFollowingTopics(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'AllFollowingTopics/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public UnFollowingTopics(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'UnFollowingTopics/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }
    public AllUnFollowingTopics(Id: any): Observable<any[]>  {
        return this.http.get(API_URL + 'AllUnFollowingTopics/' + Id)
        .map(response => { const datas = response.json(); return datas; }) .catch(this.handleError);
    }



}
