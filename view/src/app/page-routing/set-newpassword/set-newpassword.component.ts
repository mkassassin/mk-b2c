import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataSharedVarServiceService } from './../../service/data-shared-var-service/data-shared-var-service.service';


@Component({
  selector: 'app-set-newpassword',
  templateUrl: './set-newpassword.component.html',
  styleUrls: ['./set-newpassword.component.css']
})
export class SetNewpasswordComponent implements OnInit {

  constructor(private ActiveRoute: ActivatedRoute,
    private router: Router,
    private ShareingService: DataSharedVarServiceService) {
    this.ActiveRoute.params.subscribe( params => {
      console.log(params);
        this.ShareingService.SetNewPassword(params.UserId, params.Token);
        this.ShareingService.SetActiveSinInsignUpTab('SingIn');
        this.router.navigate(['SignInSignUp']);
      });
  }

  ngOnInit() {
  }

}
