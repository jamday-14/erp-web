import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  salesData: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean; borderColor: string; }[]; };
  itemSalesData: { labels: string[]; datasets: { data: number[]; backgroundColor: string[]; hoverBackgroundColor: string[]; }[]; };
  events: ({ "title": string; "start": string; "end"?: undefined; } | { "title": string; "start": string; "end": string; })[];
  calendarOptions: { defaultDate: string; header: { left: string; center: string; right: string; }; editable: boolean; };

  constructor(
    private messageService: MessageService,
    private app: AppComponent) { }

  ngOnInit() {
    this.app.title = "Dashboard";

    this.getSalesData();
    this.getItemSalesData();
    this.setCalendarOptions();
    this.getCalendarEvents();
  }
  setCalendarOptions(): any {
    this.calendarOptions = {
      defaultDate: '2018-01-01',
      header: {
          left: 'prev,next',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
      },
      editable: true
  };
  }
  getCalendarEvents(): any {
    this.events = [
      {
          "title": "All Day Event",
          "start": "2018-01-01"
      },
      {
          "title": "Long Event",
          "start": "2018-01-07",
          "end": "2018-01-10"
      },
      {
          "title": "Repeating Event",
          "start": "2018-12-09T16:00:00"
      },
      {
          "title": "Repeating Event",
          "start": "2018-01-16T16:00:00"
      },
      {
          "title": "Conference",
          "start": "2018-01-11",
          "end": "2018-01-13"
      }
  ];
  }
  getItemSalesData(): any {
    this.itemSalesData = {
      labels: ['Item 1', 'Item 2', 'Item 3'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
    };
  }

  getSalesData(): any {
    this.salesData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Sales Person 1',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#4bc0c0'
        },
        {
          label: 'Sales Person 2',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#565656'
        }
      ]
    }
  }

  selectData(event) {
    this.messageService.add({ severity: 'info', summary: 'Data Selected', data: this.salesData.datasets[event.element._datasetIndex].data[event.element._index] });
  }

}
