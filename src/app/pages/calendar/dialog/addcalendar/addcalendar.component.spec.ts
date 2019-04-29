import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcalendarComponent } from './addcalendar.component';

describe('AddcalendarComponent', () => {
  let component: AddcalendarComponent;
  let fixture: ComponentFixture<AddcalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
