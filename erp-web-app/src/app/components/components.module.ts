import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { ProgressBarModule } from 'primeng/progressbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BlockUIModule } from 'primeng/blockui';
import { TabViewModule } from 'primeng/tabview';
import { HttpClientModule } from '@angular/common/http';

import { ListItemComponent } from './list-item/list-item.component';
import { HeaderComponent } from './header/header.component';
import { ReferenceHeaderComponent } from './reference-header/reference-header.component';
import { HeaderReturnComponent } from './header-return/header-return.component';
import { InventoryHeaderComponent } from './inventory-header/inventory-header.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';
import { PaymentHeaderComponent } from './payment-header/payment-header.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { PaymentReferenceHeaderComponent } from './payment-reference-header/payment-reference-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PanelMenuModule,
    MenubarModule,
    ProgressBarModule,
    TableModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    SidebarModule,
    PanelModule,
    ToastModule,
    ChartModule,
    FullCalendarModule,
    DropdownModule,
    InputMaskModule,
    InputTextareaModule,
    MessagesModule,
    MessageModule,
    CheckboxModule,
    CalendarModule,
    AutoCompleteModule,
    BlockUIModule,
    TabViewModule
  ],
  declarations: [
    ListItemComponent,
    HeaderComponent,
    ReferenceHeaderComponent,
    HeaderReturnComponent,
    InventoryHeaderComponent,
    InventoryDetailComponent,
    PaymentHeaderComponent,
    PaymentDetailComponent,
    PaymentReferenceHeaderComponent
  ],
  exports:[
    ListItemComponent,
    HeaderComponent,
    ReferenceHeaderComponent,
    HeaderReturnComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PanelMenuModule,
    MenubarModule,
    ProgressBarModule,
    TableModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    SidebarModule,
    PanelModule,
    ToastModule,
    ChartModule,
    FullCalendarModule,
    DropdownModule,
    InputMaskModule,
    InputTextareaModule,
    MessagesModule,
    MessageModule,
    CheckboxModule,
    CalendarModule,
    AutoCompleteModule,
    BlockUIModule,
    TabViewModule,
    InventoryHeaderComponent,
    InventoryDetailComponent,
    PaymentHeaderComponent,
    PaymentDetailComponent,
    PaymentReferenceHeaderComponent
  ]
})
export class ComponentsModule { }
