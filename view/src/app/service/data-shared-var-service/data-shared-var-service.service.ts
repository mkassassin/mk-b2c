import {Component, Injectable, Input, Output, EventEmitter} from '@angular/core';

// Name Service
export interface ReturnUrl { Url: String; Id: String; }
export interface ActiveSinInsignUpTab { ActiveTab: String; Email: String; }

export interface ProfilePage { UserId: String; Other: String; }

@Injectable()
export class DataSharedVarServiceService {

  constructor() { }

  StoreReturnUrl: ReturnUrl = { Url : '', Id : '' };
  SetReturnUrl(Url, Id= null) {this.StoreReturnUrl.Url = Url; this.StoreReturnUrl.Id = Id; }
  GetReturnUrl() { return this.StoreReturnUrl; }


  StoreActiveSinInsignUpTab: ActiveSinInsignUpTab = { ActiveTab : '', Email : '' };
  SetActiveSinInsignUpTab(str, email= null) {this.StoreActiveSinInsignUpTab.ActiveTab = str; this.StoreActiveSinInsignUpTab.Email = email; }
  GetActiveSinInsignUpTab() { return this.StoreActiveSinInsignUpTab; }


  StoreProfilePage: ProfilePage = { UserId : '', Other : '' };
  SetProfilePage(UserId, Other= null) {this.StoreProfilePage.UserId = UserId; this.StoreProfilePage.Other = Other; }
  GetProfilePage() { return this.StoreProfilePage; }


}
