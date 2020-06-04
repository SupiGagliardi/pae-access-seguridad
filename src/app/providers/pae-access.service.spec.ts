import { TestBed } from '@angular/core/testing';

import { PaeAccessService } from './pae-access.service';

describe('PaeAccessService', () => {
  let service: PaeAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaeAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
