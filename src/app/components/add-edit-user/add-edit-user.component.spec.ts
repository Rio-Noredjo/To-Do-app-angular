import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserComponent } from './add-edit-user.component';
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('AddEditUserComponent', () => {
  let component: AddEditUserComponent;
  let fixture: ComponentFixture<AddEditUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditUserComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
