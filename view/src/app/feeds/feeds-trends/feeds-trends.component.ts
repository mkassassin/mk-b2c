import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';


import { PostThreeComponent } from './../../popups/post-three/post-three.component';

import { TrendsService } from "./../../service/trends-service/trends.service";

@Component({
  selector: 'app-feeds-trends',
  templateUrl: './feeds-trends.component.html',
  styleUrls: ['./feeds-trends.component.css']
})
export class FeedsTrendsComponent implements OnInit {

  scrollHeight;
  impresionsHeight;
  screenHeight:number;
  impresionscreenHeight:number;
  anotherHeight:number;

  UserInfo;
  ListOfCoins;
  ActiveCoin = 0;
  CoinListLoader:boolean = true;
  ListOfImpressions:Array<object> = new Array();
  ImpressionsListLoader:boolean = true;

  constructor(
    public dialog: MatDialog,
    private TrendsService: TrendsService
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser')); 

    this.TrendsService.CoinsList(this.UserInfo.data._id)
      .subscribe( datas => {  
          if(datas['status'] == "True"){
            this.ListOfCoins = datas['data'];
            this.CoinListLoader = false;
            this.ListOfCoins = this.ListOfCoins.sort((a, b) => a.Rate - b.Rate ).reverse();

            this.TrendsService.ImpressionPosts( this.ListOfCoins[this.ActiveCoin].CoinId)
              .subscribe( posts => {  
                  if(posts['status'] == "True"){
                    this.ListOfImpressions = posts['data'];
                    this.ImpressionsListLoader = false;
                  }else{
                    this.ImpressionsListLoader = false;
                    console.log(posts);
                  }
              });

          }else{
            this.CoinListLoader = false;
            console.log(datas);
          }
      });

   }

    // material dialog 
    PostThreeDialogRef: MatDialogRef<PostThreeComponent>;

  ngOnInit() {
    this.screenHeight = window.innerHeight - 125;
    this.impresionscreenHeight = window.innerHeight - 400;
    this.scrollHeight = this.screenHeight + "px";
    this.impresionsHeight = this.impresionscreenHeight + "px";

  }

  ChangeActiveCoin(id){
    if(this.ActiveCoin != id ){
      this.ActiveCoin = id;
      this.ListOfImpressions = [];
      this.ImpressionsListLoader = true;

      this.TrendsService.ImpressionPosts( this.ListOfCoins[this.ActiveCoin].CoinId)
          .subscribe( posts => {  
              if(posts['status'] == "True"){
                this.ListOfImpressions = posts['data'];
                this.ImpressionsListLoader = false;
              }else{
                this.ImpressionsListLoader = false;
                console.log(posts);
              }
          });
    }
  }

  OpenModel() {
    let PostThreeDialogRef = this.dialog.open(PostThreeComponent, {disableClose:true, minWidth:'50%', position: {top: '50px'},  data: { CoinId : this.ListOfCoins[this.ActiveCoin].CoinId } });
    PostThreeDialogRef.afterClosed().subscribe(result => this.GoToAnalize(result));
  }
  
  GoToAnalize(result){

    if(result !== "Close" && result.PostText !== ''){
        let data = {'UserId': this.UserInfo.data._id, 
            'PostText': result.PostText,
            'CoinId':  this.ListOfCoins[this.ActiveCoin].CoinId,
            'PostDate':  new Date()
          }
        this.TrendsService.ImpressionAdd(data).subscribe( datas => {
          if(datas['status'] == "True" && !datas['message']){

            if(this.ListOfImpressions == undefined){
              var data = new Array();
                data.push(datas['data']);
                this.ListOfImpressions = data;
            }else{
              this.ListOfImpressions.splice(0, 0, datas['data']);
            } 
          }else{
              console.log(datas);
          }
        });
    }
  }

  onTabChange(event) {
    console.log(event);
  }

}
