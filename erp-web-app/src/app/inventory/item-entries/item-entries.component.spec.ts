import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEntriesComponent } from './item-entries.component';

describe('ItemEntriesComponent', () => {
  let component: ItemEntriesComponent;
  let fixture: ComponentFixture<ItemEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
