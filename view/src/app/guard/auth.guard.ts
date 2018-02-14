import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataSharedVarServiceService } from './../service/data-shared-var-service/data-shared-var-service.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private ShareingService: DataSharedVarServiceService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.ShareingService.SetReturnUrl('', '');
        this.ShareingService.SetActiveSinInsignUpTab('', '');
        if (localStorage.getItem('currentUser')) {
            const LoginDate = new Date(atob(localStorage.getItem('UserToken'))).getTime();
            const NewDate = new Date().getTime();
            const time = NewDate - LoginDate;
            const diffInHours: number = time / 1000 / 60 / 60;
            if (diffInHours < 2) {
                return true;
            }else {
                this.ShareingService.SetActiveSinInsignUpTab('SingIn', JSON.parse(localStorage.getItem('currentUser')).data.UserEmail);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('UserToken');
                this.router.navigate(['SignInSignUp']);
                return false;
            }

        }else {
            this.ShareingService.SetActiveSinInsignUpTab('SingIn');
            this.ShareingService.SetReturnUrl(state.url);
            this.router.navigate(['SignInSignUp']);
            return false;
        }
    }

}