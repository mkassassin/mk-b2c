import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { FollowServiceService } from './../../service/follow-service/follow-service.service';
import { PostThreeComponent } from './../../popups/post-three/post-three.component';
import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';
import { TrendsService } from './../../service/trends-service/trends.service';

import { ReportUserComponent } from './../../popups/report-user/report-user.component';
import { ReportPostComponent } from './../../popups/report-post/report-post.component';
import { DeleteConfirmComponent } from './../../popups/delete-confirm/delete-confirm.component';
import { ReportAndDeleteService } from './../../service/report-and-delete-service/report-and-delete.service';

import { Pipe, PipeTransform } from '@angular/core';
import { CoinFilterPipe } from './../../Pipes/Coin-filter-pipe';

@Component({
  selector: 'app-feeds-trends',
  templateUrl: './feeds-trends.component.html',
  styleUrls: ['./feeds-trends.component.css']
})
export class FeedsTrendsComponent implements OnInit {

  ImageBaseUrl: String = 'http://localhost:3000/static/images';
  VideoBaseUrl: String = 'http://localhost:3000/static/videos';
  UserImageBaseUrl: String = 'http://localhost:3000/static/users';
  TopicImageBaseUrl: String = 'http://localhost:3000/static/topics';
  OtherImageBaseUrl: String = 'http://localhost:3000/static/others';

  scrollHeight;
  impresionsHeight;
  screenHeight: number;
  impresionscreenHeight: number;
  anotherHeight: number;
  PredictionAddButton: Boolean = true;

  UserInfo;
  ListOfCoins;
  ActiveCoin = 0;
  ActiveCoinSymbol;
  CoinListLoader: Boolean = true;
  ListOfImpressions: Array<object> = new Array();
  ImpressionsListLoader: Boolean = true;
  ChartLoader: Boolean = true;
  Info: any[] = [];
  Prediction: any[] = [];

  lineChartData: Array<any> = [];
  lineChartLabels: Array<any> = [];
  lineChartLegend: Boolean = false;
  lineChartType: String = 'line';
  lineChartOptions: any = { responsive: true };

  lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(255, 217, 0, 0.3)',
      borderColor: 'rgba(255, 217, 0, 1)',
      pointBackgroundColor: 'rgba(230, 176, 0, 1)',
      pointBorderColor: 'rgba(230, 176, 0, 1)',
      pointHoverBackgroundColor: 'rgba(230, 176, 0, 0.5)',
      pointHoverBorderColor: 'rgba(230, 176, 0, 0.5)'
    }
  ];


  reportUserId;
  reportImpressionInfo;


  constructor(private router: Router,
    private FollowService: FollowServiceService,
    private ShareService: DataSharedVarServiceService,
    public dialog: MatDialog,
    private trendsService: TrendsService,
    private DeleteService: ReportAndDeleteService,
    public snackBar: MatSnackBar,
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('currentUser'));

    this.trendsService.CoinsList(this.UserInfo.data._id)
      .subscribe( datas => {
          if (datas['status'] === 'True') {
            this.ListOfCoins = datas['data'];
            this.CoinListLoader = false;
            const Keys = Object.keys(datas['data']);
            const Response = [];
            Keys.forEach((item, index) => {
                Response.push(this.ListOfCoins[item]);
            });
            this.ListOfCoins = Response.sort((a, b) => a.SortOrder - b.SortOrder);
            this.ListOfCoins = this.ListOfCoins.splice(0, 100);
            this.ActiveCoinSymbol = this.ListOfCoins[0].Symbol;
            this.trendsService.CoinPriceInfo(this.ActiveCoinSymbol)
            .subscribe( priceInfo => {
                if (priceInfo['status'] === 'True') {
                  this.Info = priceInfo['data'][this.ActiveCoinSymbol]['USD'];
                }else {
                  console.log(priceInfo);
                }
            });

            this.trendsService.ImpressionPosts( this.ActiveCoinSymbol, this.UserInfo.data._id)
              .subscribe( posts => {
                  if (posts['status'] === 'True') {
                    this.ListOfImpressions = posts['data'];
                    this.ImpressionsListLoader = false;
                  }else {
                    this.ImpressionsListLoader = false;
                    console.log(posts);
                  }
              });

              this.trendsService.GetPrediction( this.ActiveCoinSymbol, this.UserInfo.data._id)
              .subscribe( data => {
                  if (data['status'] === 'True') {
                    this.Prediction = data['data'];
                  }else {
                    console.log(data);
                  }
              });

              this.trendsService.ChartInfo( this.ActiveCoinSymbol)
              .subscribe( posts => {
                  if (posts['status'] === 'True') {
                    this.lineChartData = posts['data'].Values;
                    this.lineChartLabels =  posts['data'].Dates;
                    this.ChartLoader = false;
                  }else {
                    this.ChartLoader = false;
                    console.log(posts);
                  }
              });

          }else {
            this.CoinListLoader = false;
            console.log(datas);
          }
      });

   }


  chartClicked(e: any): void {
      console.log(e);
    }

  chartHovered(e: any): void {
      console.log(e);
    }


  ngOnInit() {
    this.screenHeight = window.innerHeight - 160;
    this.impresionscreenHeight = window.innerHeight - 585;
    this.scrollHeight = this.screenHeight + 'px';
    this.impresionsHeight = this.impresionscreenHeight + 'px';
  }

  ChangeActiveCoin(symbol) {
    if (this.ActiveCoinSymbol !== symbol ) {
      this.ActiveCoinSymbol = symbol;
      this.trendsService.CoinPriceInfo(this.ActiveCoinSymbol)
        .subscribe( priceInfo => {
            if (priceInfo['status'] === 'True') {
              this.Info = priceInfo['data'][this.ActiveCoinSymbol]['USD'];
            }else {
              console.log(priceInfo);
            }
        });

      this.ListOfImpressions = [];
      this.ImpressionsListLoader = true;
      this.PredictionAddButton = true;

      this.trendsService.ImpressionPosts( this.ActiveCoinSymbol, this.UserInfo.data._id)
          .subscribe( posts => {
              if (posts['status'] === 'True') {
                this.ListOfImpressions = posts['data'];
                this.ImpressionsListLoader = false;
              }else {
                this.ImpressionsListLoader = false;
                console.log(posts);
              }
          });

      this.trendsService.GetPrediction( this.ActiveCoinSymbol, this.UserInfo.data._id)
          .subscribe( data => {
              if (data['status'] === 'True') {
                this.Prediction = data['data'];
                console.log(data);
              }else {
                console.log(data);
              }
          });

      this.trendsService.ChartInfo( this.ActiveCoinSymbol )
          .subscribe( posts => {
              if (posts['status'] === 'True') {
                this.lineChartData = posts['data'].Values;
                this.lineChartLabels =  posts['data'].Dates;
                this.ChartLoader = false;
              }else {
                this.ChartLoader = false;
                console.log(posts);
              }
          });
    }
  }

  OpenModel() {
    const PostThreeDialogRef = this.dialog.open(PostThreeComponent, {
      disableClose: true, minWidth: '700px', position: {top: '50px'},
       data: { type: 'Add', CoinCode : this.ActiveCoinSymbol } });
    PostThreeDialogRef.afterClosed().subscribe(result => this.GoToAnalize(result));
  }

  GoToAnalize(result) {
    if (result !== 'Close' && result.PostText !== '') {
        const data = {'UserId': this.UserInfo.data._id,
            'PostText': result.PostText,
            'CoinCode':  this.ActiveCoinSymbol,
            'PostDate':  new Date()
          };
        this.trendsService.ImpressionAdd(data).subscribe( datas => {
          if (datas['status'] === 'True' && !datas['message']) {

            if (this.ListOfImpressions === undefined) {
              const NewData = new Array();
                NewData.push(datas['data']);
                this.ListOfImpressions = NewData;
            }else {
              this.ListOfImpressions.splice(0, 0, datas['data']);
            }
          }else {
              console.log(datas);
          }
        });
    }
  }

  onTabChange(event) {
    console.log(event);
  }




  AddPrediction(value) {
    if (value !== '') {
      const index = this.ListOfCoins.findIndex(x => x['Symbol'] === this.ActiveCoinSymbol);

    const data = {'UserId': this.UserInfo.data._id,
              'CoinCode': this.ActiveCoinSymbol,
              'CoinName':  this.ListOfCoins[index].FullName,
              'Value': value
            };
          this.PredictionAddButton = true;
          this.trendsService.PredictionAdd(data).subscribe( datas => {
            if (datas['status'] === 'True' && !datas['message']) {

              this.trendsService.GetPrediction( this.ActiveCoinSymbol, this.UserInfo.data._id)
              .subscribe( newdata => {
                  if (newdata['status'] === 'True') {
                    this.Prediction = newdata['data'];
                  }else {
                    console.log(newdata);
                  }
              });
            }else {
                console.log(datas);
            }
          });
    }
  }



  GotoProfile(Id) {
    this.ShareService.SetProfilePage(Id);
    this.router.navigate(['ViewProfile']);
  }


  followUser(Id: String, index) {
    const data =  { 'UserId' : this.UserInfo.data._id, 'FollowingUserId' : Id };
      this.FollowService.FollowUser(data)
        .subscribe( datas => {
          if (datas.status === 'True') {
            this.ListOfImpressions[index]['AlreadyFollow'] = true;
          }else {
            console.log(datas);
          }
      });
  }



  TriggerPostInfo(index) {
    this.reportImpressionInfo = this.ListOfImpressions[index];
    this.reportUserId = this.reportImpressionInfo.UserId;
  }

  ReportUser() {
    const ReportUser = {'UserId': this.UserInfo.data._id,
                        'ReportUserId':  this.reportUserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportUserComponent,
      {disableClose: true, minWidth: '700px', position: {top: '50px'},  data: { type: 'User', values: ReportUser  } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }


  ReportImpression() {
    const ReportComment = { 'UserId': this.UserInfo.data._id,
                        'PostId':  this.reportImpressionInfo.CoinId,
                        'SecondLevelPostType': 'Impression',
                        'SecondLevelPostId':  this.reportImpressionInfo._id,
                        'SecondLevelPostUserId': this.reportImpressionInfo.UserId
                      };
    const ReportUserDialogRef = this.dialog.open( ReportPostComponent,
      {disableClose: true, minWidth: '700px', position: {top: '50px'},
      data: { exactType: 'Opinion', type: 'SecondLevelPost', values: ReportComment } });
      ReportUserDialogRef.afterClosed().subscribe(result => console.log(result));
  }



  DeleteImpression() {
    const DeleteConfirmrDialogRef = this.dialog.open( DeleteConfirmComponent,
      {disableClose: true, width: '350px', minHeight: '300px', position: {top: '50px'},
      data: {text: 'Are You Sure You Want To Permanently Delete This Opinion?'} });
      DeleteConfirmrDialogRef.afterClosed().subscribe( result => {
        if (result === 'Yes' ) {
          const DeletePostdata =  { 'UserId' : this.UserInfo.data._id, 'ImpressionId' : this.reportImpressionInfo._id };
          this.DeleteService.DeleteImpression(DeletePostdata)
            .subscribe( datas => {
              if (datas.status === 'True') {
                const index = this.ListOfImpressions.findIndex(x => x['_id'] === this.reportImpressionInfo._id);
                this.ListOfImpressions.splice(index, 1);
                this.snackBar.open( 'Your Opinion Deleted Successfully', ' ', {
                  horizontalPosition: 'center',
                  duration: 3000,
                  verticalPosition: 'top',
                });
              }else {
                this.snackBar.open( ' Opinion Delete Failed', ' ', {
                  horizontalPosition: 'center',
                  duration: 3000,
                  verticalPosition: 'top',
                });
                console.log(datas);
              }
          });
        }
      });
  }


  EditImpression() {
    const EditDialogRef = this.dialog.open( PostThreeComponent,
      {disableClose: true, minWidth: '700px', position: {top: '50px'}, data: {type: 'Edit', data: this.reportImpressionInfo } });
      EditDialogRef.afterClosed().subscribe( result => {
        if ( result !== 'Close') {
          const index = this.ListOfImpressions.findIndex(x => x['_id'] === this.reportImpressionInfo._id);
          this.ListOfImpressions[index]['PostText'] = result.PostText;
        }
      });
  }

}
