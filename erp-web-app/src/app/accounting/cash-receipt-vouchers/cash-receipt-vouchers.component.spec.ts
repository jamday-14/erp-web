import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashReceiptVouchersComponent } from './cash-receipt-vouchers.component';

describe('CashReceiptVouchersComponent', () => {
  let component: CashReceiptVouchersComponent;
  let fixture: ComponentFixture<CashReceiptVouchersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashReceiptVouchersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashReceiptVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
