import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemEntryComponent } from './item-entry/item-entry.component';
import { ItemEntriesComponent } from './item-entries/item-entries.component';
import { ItemReleasesComponent } from './item-releases/item-releases.component';
import { ItemReleaseComponent } from './item-release/item-release.component';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component';

export const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      { path: '', redirectTo: 'item-entries', pathMatch: 'full' },
      { path: 'item-entries', component: ItemEntriesComponent },
      { path: 'item-entry', component: ItemEntryComponent },
      { path: 'item-releases', component: ItemReleasesComponent },
      { path: 'item-release', component: ItemReleaseComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ItemEntryComponent,
    ItemEntriesComponent,
    ItemReleasesComponent,
    ItemReleaseComponent,
    InventoryComponent
  ],
  exports: [RouterModule]
})
export class InventoryModule { }
