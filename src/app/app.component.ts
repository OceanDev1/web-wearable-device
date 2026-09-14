import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'client_heath_wearable';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.checkToken();
  }

  checkToken() {
    const token = localStorage.getItem('token_health');

    if (!token) this.router.navigate(['./authentication']);

    this.authenticationService.getAccountByToken().subscribe((result) => {
      if (!result['error']) {
      } else {
         this.router.navigate(['./authentication']);
      }
    });
  }
}
