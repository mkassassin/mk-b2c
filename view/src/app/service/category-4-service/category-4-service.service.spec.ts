import { TestBed, inject } from '@angular/core/testing';

import { Category4ServiceService } from './category-4-service.service';

describe('Category4ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Category4ServiceService]
    });
  });

  it('should be created', inject([Category4ServiceService], (service: Category4ServiceService) => {
    expect(service).toBeTruthy();
  }));
});
