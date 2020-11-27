import { TestBed } from '@angular/core/testing';

import { UmanaCourseService } from './umana-course.service';

describe('UmanaCourseService', () => {
  let service: UmanaCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UmanaCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
