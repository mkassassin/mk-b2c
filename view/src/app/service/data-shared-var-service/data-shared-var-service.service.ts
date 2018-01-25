import {Component, Injectable, Input, Output, EventEmitter} from '@angular/core'

// Name Service
export interface ActiveSinInsignUpTab { ActiveTab:string; Email:string; }

@Injectable()
export class DataSharedVarServiceService {

  constructor() { }

  StoreActiveSinInsignUpTab: ActiveSinInsignUpTab = { ActiveTab :"", Email : "" };
  SetActiveSinInsignUpTab(str, email=null){this.StoreActiveSinInsignUpTab.ActiveTab = str; this.StoreActiveSinInsignUpTab.Email = email; }
  GetActiveSinInsignUpTab(){ return this.StoreActiveSinInsignUpTab; }

  

}
