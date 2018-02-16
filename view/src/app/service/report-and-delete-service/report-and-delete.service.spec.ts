import { TestBed, inject } from '@angular/core/testing';

import { ReportAndDeleteService } from './report-and-delete.service';

describe('ReportAndDeleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportAndDeleteService]
    });
  });

  it('should be created', inject([ReportAndDeleteService], (service: ReportAndDeleteService) => {
    expect(service).toBeTruthy();
  }));
});
