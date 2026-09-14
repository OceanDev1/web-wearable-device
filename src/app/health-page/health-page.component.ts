import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IConfigs } from 'src/utils/configs/IConfigs';
import { MqttServices } from '../services/mqtt.service';
import { ToastService } from '../services/toast.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-health-page',
  templateUrl: './health-page.component.html',
  styleUrls: ['./health-page.component.scss'],
})
export class HealthPageComponent implements OnInit {
  menus: Array<any> = IConfigs.MENU_DASHBOARD;

  account_detail: any = null;

  menu_active: Number = 2;
  title_page: String = '';

  constructor(
    private router: Router,
    private mqtt: MqttServices,
    private toastServices: ToastService,
    private authenticationServices: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.mqtt.connect();
    this.getActiveRoute();
    this.getAccountByToken();
  }

  getActiveRoute() {
    let url = this.router.url.split('/')[2];
    const index = this.menus.findIndex((x: any) => x.page == url);

    if (index != -1) {
      this.title_page = this.menus[index].name;
      this.menu_active = this.menus[index].number;
    }
  }

  getAccountByToken() {
    this.authenticationServices.getAccountByToken().subscribe((result) => {
      console.log(`getAccountByToken`, result);

      if (!result['error']) {
        this.account_detail = result.metadata;
      } else this.router.navigate(['./authentication']);
    });
  }

  changePage(menu: any) {
    this.menu_active = menu.number;
    this.title_page = this.menus[menu.number].name;
    this.router.navigate(['./health-page', menu.page]);
  }

  logOut() {
    this.router.navigate(['./authentication']);
  }
}
