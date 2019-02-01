import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsTransferReceiptComponent } from './goods-transfer-receipt.component';

describe('GoodsTransferReceiptComponent', () => {
  let component: GoodsTransferReceiptComponent;
  let fixture: ComponentFixture<GoodsTransferReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsTransferReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsTransferReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
