import { TestBed, inject } from '@angular/core/testing';

import { ComponentConnectServiceService } from './component-connect-service.service';

describe('ComponentConnectServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComponentConnectServiceService]
    });
  });

  it('should be created', inject([ComponentConnectServiceService], (service: ComponentConnectServiceService) => {
    expect(service).toBeTruthy();
  }));
});
