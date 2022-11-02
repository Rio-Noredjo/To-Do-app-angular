import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditItemComponent } from './add-edit-item.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NgSelectModule} from "@ng-select/ng-select";

describe('AddEditItemComponent', () => {
  let component: AddEditItemComponent;
  let fixture: ComponentFixture<AddEditItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        NgSelectModule],
      declarations: [AddEditItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
