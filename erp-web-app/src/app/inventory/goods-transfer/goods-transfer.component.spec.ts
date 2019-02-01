import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsTransferComponent } from './goods-transfer.component';

describe('GoodsTransferComponent', () => {
  let component: GoodsTransferComponent;
  let fixture: ComponentFixture<GoodsTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
