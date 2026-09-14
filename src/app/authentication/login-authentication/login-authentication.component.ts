import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { SupportFunctionServices } from 'src/utils/supports/function.supports';

@Component({
  selector: 'app-login-authentication',
  templateUrl: './login-authentication.component.html',
  styleUrls: ['./login-authentication.component.scss'],
})
export class LoginAuthenticationComponent implements OnInit {
  act_phone: String = '0969827996';
  act_password: String = '123456';

  constructor(
    private authenticationServices: AuthenticationService,
    private toastServices: ToastService,
    private router: Router,
    private supportServices: SupportFunctionServices
  ) {}

  ngOnInit(): void {}

  loginAccount() {
    const form_data = {
      phone_number: this.act_phone,
      password: this.act_password,
    };

    const rules = {
      phone_number: { required: true, phone: true },
      password: { required: true },
    };

    const check = this.supportServices.checkValidationForm(form_data, rules);
    if (check.isValid) {
      this.authenticationServices.loginAccount(form_data).subscribe((res) => {
        if (!res['error']) {
          const token = res.metadata;
          this.act_phone = '';
          this.act_password = '';
          localStorage.setItem('token_health', token);
          this.router.navigate(['./health-page']);
        } else this.toastServices.showToastError(res['error'].message);
      });
    } else this.toastServices.showErrorValidation(check.errors);
  }
}
