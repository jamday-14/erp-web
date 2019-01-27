import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemReleasesComponent } from './item-releases.component';

describe('ItemReleasesComponent', () => {
  let component: ItemReleasesComponent;
  let fixture: ComponentFixture<ItemReleasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemReleasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
