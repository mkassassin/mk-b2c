import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ComponentConnectServiceService {
  private _listners = new Subject<any>();

  listen(): Observable<any> {
     return this._listners.asObservable();
  }

  OnLoadGallery() {
     this._listners.next();
  }

}
