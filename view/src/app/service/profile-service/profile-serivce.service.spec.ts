import { TestBed, inject } from '@angular/core/testing';

import { ProfileSerivceService } from './profile-serivce.service';

describe('ProfileSerivceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileSerivceService]
    });
  });

  it('should be created', inject([ProfileSerivceService], (service: ProfileSerivceService) => {
    expect(service).toBeTruthy();
  }));
});
