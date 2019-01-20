import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingReportsComponent } from './receiving-reports.component';

describe('ReceivingReportsComponent', () => {
  let component: ReceivingReportsComponent;
  let fixture: ComponentFixture<ReceivingReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivingReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
