import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-by-type',
  templateUrl: './by-type.page.html',
  styleUrls: ['./by-type.page.scss'],
})
export class ByTypePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  refreshPage(): void {
    window.location.reload();
  }
}
