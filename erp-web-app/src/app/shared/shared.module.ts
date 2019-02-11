import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountTypesPipe } from './account-types.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AccountTypesPipe],
  exports: [AccountTypesPipe]
})
export class SharedModule { }
