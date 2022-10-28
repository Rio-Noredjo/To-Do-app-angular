import { TestBed } from '@angular/core/testing';

import { AddEditItemService } from './add-edit-item.service';

describe('AddEditItemService', () => {
  let service: AddEditItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddEditItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
