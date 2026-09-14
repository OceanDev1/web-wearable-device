import { AuthenticationRoutingModule } from './authentication.routing';
import { AuthenticationComponent } from './authentication.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginAuthenticationComponent } from './login-authentication/login-authentication.component';

@NgModule({
  declarations: [
   AuthenticationComponent,
   LoginAuthenticationComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AuthenticationRoutingModule
  ],
  providers: [],
})
export class AuthenticationModule {}

