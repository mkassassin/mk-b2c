import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataSharedVarServiceService } from "./../service/data-shared-var-service/data-shared-var-service.service";
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router, private ShareingService: DataSharedVarServiceService,) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.ShareingService.SetReturnUrl('','');
        this.ShareingService.SetActiveSinInsignUpTab('','');
        if (localStorage.getItem('currentUser')) {
            return true;
        }else{
            this.ShareingService.SetActiveSinInsignUpTab('SingIn');
            this.ShareingService.SetReturnUrl(state.url);
            this.router.navigate(['SignInSignUp']);
            return false;
        }
    }
}