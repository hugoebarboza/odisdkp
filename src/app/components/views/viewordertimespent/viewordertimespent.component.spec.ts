import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewordertimespentComponent } from './viewordertimespent.component';

describe('ViewordertimespentComponent', () => {
  let component: ViewordertimespentComponent;
  let fixture: ComponentFixture<ViewordertimespentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewordertimespentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewordertimespentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
