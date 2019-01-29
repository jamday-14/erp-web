import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemEntryComponent } from './item-entry/item-entry.component';
import { ItemEntriesComponent } from './item-entries/item-entries.component';
import { ItemReleasesComponent } from './item-releases/item-releases.component';
import { ItemReleaseComponent } from './item-release/item-release.component';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { ComponentsModule } from '../components/components.module';

export const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      { path: '', redirectTo: 'item-entries', pathMatch: 'full' },
      { path: 'item-entries', component: ItemEntriesComponent },
      { path: 'item-entry/:id', component: ItemEntryComponent },
      { path: 'item-releases', component: ItemReleasesComponent },
      { path: 'item-release', component: ItemReleaseComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ItemEntryComponent,
    ItemEntriesComponent,
    ItemReleasesComponent,
    ItemReleaseComponent,
    InventoryComponent
  ]
})
export class InventoryModule { }
