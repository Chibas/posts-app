import { TestBed, inject } from '@angular/core/testing';

import { LoadPostsService } from './load-posts.service';

describe('LoadPostsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadPostsService]
    });
  });

  it('should be created', inject([LoadPostsService], (service: LoadPostsService) => {
    expect(service).toBeTruthy();
  }));
});
