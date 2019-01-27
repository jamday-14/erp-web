import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-item-entries',
  templateUrl: './item-entries.component.html',
  styleUrls: ['./item-entries.component.css']
})
export class ItemEntriesComponent implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.app.title = "Item Entries";
  }

}
