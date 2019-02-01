import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsTransfersComponent } from './goods-transfers.component';

describe('GoodsTransfersComponent', () => {
  let component: GoodsTransfersComponent;
  let fixture: ComponentFixture<GoodsTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsTransfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
