import { TestBed, inject } from '@angular/core/testing';

import { SigninSignupServiceService } from './signin-signup-service.service';

describe('SigninSignupServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SigninSignupServiceService]
    });
  });

  it('should be created', inject([SigninSignupServiceService], (service: SigninSignupServiceService) => {
    expect(service).toBeTruthy();
  }));
});
