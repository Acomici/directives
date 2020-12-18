import { TestBed } from '@angular/core/testing';

import { AcomiDirectivesService } from './acomi-directives.service';

describe('AcomiDirectivesService', () => {
  let service: AcomiDirectivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcomiDirectivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
