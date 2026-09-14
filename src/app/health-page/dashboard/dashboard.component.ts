import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data_dashboard: any = null;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.getDataDashboardAccount();
  }

  getDataDashboardAccount() {
    let timestamp = new Date();

    this.authenticationService
      .getDataDashboard(timestamp)
      .subscribe((result) => {
        if (!result['error']) {
          this.data_dashboard = result.metadata;
          console.log(this.data_dashboard);
        } else this.data_dashboard = null;
      });
  }
}
