import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditToDoItemComponent } from './add-edit-to-do-item.component';

describe('AddEditToDoItemComponent', () => {
  let component: AddEditToDoItemComponent;
  let fixture: ComponentFixture<AddEditToDoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditToDoItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditToDoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
