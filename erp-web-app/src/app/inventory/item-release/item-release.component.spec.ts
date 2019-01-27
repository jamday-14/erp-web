import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemReleaseComponent } from './item-release.component';

describe('ItemReleaseComponent', () => {
  let component: ItemReleaseComponent;
  let fixture: ComponentFixture<ItemReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
