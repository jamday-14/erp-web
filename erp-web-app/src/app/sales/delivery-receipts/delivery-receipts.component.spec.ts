import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryReceiptsComponent } from './delivery-receipts.component';

describe('DeliveryReceiptsComponent', () => {
  let component: DeliveryReceiptsComponent;
  let fixture: ComponentFixture<DeliveryReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
