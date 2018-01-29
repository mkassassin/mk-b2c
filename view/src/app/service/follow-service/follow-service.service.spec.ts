import { TestBed, inject } from '@angular/core/testing';

import { FollowServiceService } from './follow-service.service';

describe('FollowServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FollowServiceService]
    });
  });

  it('should be created', inject([FollowServiceService], (service: FollowServiceService) => {
    expect(service).toBeTruthy();
  }));
});
