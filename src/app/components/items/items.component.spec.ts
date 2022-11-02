import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsComponent } from './items.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('ItemsComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],

    }).compileComponents();

    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
