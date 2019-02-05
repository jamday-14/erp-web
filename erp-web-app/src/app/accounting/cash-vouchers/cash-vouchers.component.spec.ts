import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashVouchersComponent } from './cash-vouchers.component';

describe('CashVouchersComponent', () => {
  let component: CashVouchersComponent;
  let fixture: ComponentFixture<CashVouchersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashVouchersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
