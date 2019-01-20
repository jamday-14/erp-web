import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingReportComponent } from './receiving-report.component';

describe('ReceivingReportComponent', () => {
  let component: ReceivingReportComponent;
  let fixture: ComponentFixture<ReceivingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
