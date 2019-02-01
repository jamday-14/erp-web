import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsTransferReceiptsComponent } from './goods-transfer-receipts.component';

describe('GoodsTransferReceiptsComponent', () => {
  let component: GoodsTransferReceiptsComponent;
  let fixture: ComponentFixture<GoodsTransferReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsTransferReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsTransferReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
