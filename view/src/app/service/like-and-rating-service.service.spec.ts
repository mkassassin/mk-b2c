import { TestBed, inject } from '@angular/core/testing';

import { LikeAndRatingServiceService } from './like-and-rating-service.service';

describe('LikeAndRatingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LikeAndRatingServiceService]
    });
  });

  it('should be created', inject([LikeAndRatingServiceService], (service: LikeAndRatingServiceService) => {
    expect(service).toBeTruthy();
  }));
});
