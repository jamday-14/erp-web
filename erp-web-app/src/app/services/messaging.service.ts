import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  SUCCESS: string = "success"
  SUCCESS_HEADER: string = "Success Message"
  ERROR: string = "error"
  ERROR_HEADER: string = "Error Message"
  WARN: string = "warn"
  WARN_HEADER: string = "Warning Message"

  ADD_ERROR: string = "Failed creating a record.";
  ADD_SUCCESS: string = "Successful creating a record."
  REQUIRED: string = "Please complete all required fields mark with asterisk (*)"
  ONE_LINE_ITEM: string = "Please provide at least one order line item."
  QTY_AND_PRICE: string = "Please specify quantity and unit price for all order line items."
  WAREHOUSE_ITEMS: string = "Please select warehouse for all line items."
  DELETE_SUCCESS: string = "Successfully deleted selected record/s";
  DELETE_ERROR: string = "Failed deleting record/s.";

  constructor(private messageService: MessageService) { }

  errorMessage(message: string) {
    this.messageService.add({ severity: this.ERROR, summary: this.ERROR_HEADER, detail: message });
  }
  warningMessage(message: string) {
    this.messageService.add({ severity: this.WARN, summary: this.WARN_HEADER, detail: message });
  }
  successMessage(message: string) {
    this.messageService.add({ severity: this.SUCCESS, summary: this.SUCCESS_HEADER, detail: message });
  }
}
