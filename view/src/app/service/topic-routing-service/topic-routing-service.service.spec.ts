import { TestBed, inject } from '@angular/core/testing';

import { TopicRoutingServiceService } from './topic-routing-service.service';

describe('TopicRoutingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopicRoutingServiceService]
    });
  });

  it('should be created', inject([TopicRoutingServiceService], (service: TopicRoutingServiceService) => {
    expect(service).toBeTruthy();
  }));
});
