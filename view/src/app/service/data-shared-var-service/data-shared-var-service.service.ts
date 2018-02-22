import {Component, Injectable, Input, Output, EventEmitter} from '@angular/core';

// Name Service
export interface ReturnUrl { Url: String; Id: String; }
export interface ActiveSinInsignUpTab { ActiveTab: String; Email: String; }

export interface SingUpType { Type: String; Values: any; }

export interface NewPassword { UserId: String; Token: any; }

export interface ProfilePage { UserId: String; Other: String; }


export interface TopicQuestions { TopicId: String; Other: String; }
@Injectable()
export class DataSharedVarServiceService {

  constructor() { }

  StoreSingUpType: SingUpType = { Type: '', Values : '' };
  SetSingUpType(Type, Values = null) {this.StoreSingUpType.Type = Type; this.StoreSingUpType.Values = Values; }
  GetSingUpType() { return this.StoreSingUpType; }


  StoreReturnUrl: ReturnUrl = { Url : '', Id : '' };
  SetReturnUrl(Url, Id= null) {this.StoreReturnUrl.Url = Url; this.StoreReturnUrl.Id = Id; }
  GetReturnUrl() { return this.StoreReturnUrl; }


  StoreActiveSinInsignUpTab: ActiveSinInsignUpTab = { ActiveTab : '', Email : '' };
  SetActiveSinInsignUpTab(str, email= null) {this.StoreActiveSinInsignUpTab.ActiveTab = str; this.StoreActiveSinInsignUpTab.Email = email; }
  GetActiveSinInsignUpTab() { return this.StoreActiveSinInsignUpTab; }


  StoreProfilePage: ProfilePage = { UserId : '', Other : '' };
  SetProfilePage(UserId, Other= null) {this.StoreProfilePage.UserId = UserId; this.StoreProfilePage.Other = Other; }
  GetProfilePage() { return this.StoreProfilePage; }



  StoreNewPassword: NewPassword = { UserId : '', Token : '' };
  SetNewPassword(UserId, Token) {this.StoreNewPassword.UserId = UserId; this.StoreNewPassword.Token = Token; }
  GetNewPassword() { return this.StoreNewPassword; }



  StoreTopicQuestions: TopicQuestions = { TopicId : '', Other : '' };
  SetTopicQuestions(TopicId, Other= null) {this.StoreTopicQuestions.TopicId = TopicId; this.StoreTopicQuestions.Other = Other; }
  GetTopicQuestions() { return this.StoreTopicQuestions; }


}
