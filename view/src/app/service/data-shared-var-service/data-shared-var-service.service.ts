import {Component, Injectable, Input, Output, EventEmitter} from '@angular/core'

// Name Service
export interface ReturnUrl { Url:string; Id:string; }
export interface ActiveSinInsignUpTab { ActiveTab:string; Email:string; }

@Injectable()
export class DataSharedVarServiceService {

  constructor() { }

  StoreReturnUrl: ReturnUrl = { Url :"", Id : "" };
  SetReturnUrl(Url,Id=null){this.StoreReturnUrl.Url = Url; this.StoreReturnUrl.Id = Id; }
  GetReturnUrl(){ return this.StoreReturnUrl; }

  
  StoreActiveSinInsignUpTab: ActiveSinInsignUpTab = { ActiveTab :"", Email : "" };
  SetActiveSinInsignUpTab(str, email=null){this.StoreActiveSinInsignUpTab.ActiveTab = str; this.StoreActiveSinInsignUpTab.Email = email; }
  GetActiveSinInsignUpTab(){ return this.StoreActiveSinInsignUpTab; }

  

}
