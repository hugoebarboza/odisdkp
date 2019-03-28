import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsupportComponent } from './addsupport.component';

describe('AddsupportComponent', () => {
  let component: AddsupportComponent;
  let fixture: ComponentFixture<AddsupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
