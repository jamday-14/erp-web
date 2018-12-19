import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesInvoicesComponent } from './sales-invoices.component';

describe('SalesInvoicesComponent', () => {
  let component: SalesInvoicesComponent;
  let fixture: ComponentFixture<SalesInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
