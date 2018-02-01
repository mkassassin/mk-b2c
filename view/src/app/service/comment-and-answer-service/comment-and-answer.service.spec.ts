import { TestBed, inject } from '@angular/core/testing';

import { CommentAndAnswerService } from './comment-and-answer.service';

describe('CommentAndAnswerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentAndAnswerService]
    });
  });

  it('should be created', inject([CommentAndAnswerService], (service: CommentAndAnswerService) => {
    expect(service).toBeTruthy();
  }));
});
