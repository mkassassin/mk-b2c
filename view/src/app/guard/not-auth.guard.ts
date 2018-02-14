import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataSharedVarServiceService } from './../service/data-shared-var-service/data-shared-var-service.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

    constructor(private router: Router, private ShareingService: DataSharedVarServiceService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            this.router.navigate(['Feeds']);
            return false;
        }else {
            return true;
        }
    }
}