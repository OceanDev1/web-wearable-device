import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SupportFunctionServices } from 'src/utils/supports/function.supports';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

let result = '';
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;
let counter = 0;
while (counter < 10) {
  result += characters.charAt(Math.floor(Math.random() * charactersLength));
  counter += 1;
}

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: "139.59.115.246",
  port: 9001,
  protocol: 'ws',
  path: '',
  username: 'mesh',
  password: 'mesh@12345',
  clientId: result,
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      preventDuplicates: true,
    }),
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
  ],
  providers: [SupportFunctionServices],
  bootstrap: [AppComponent]
})
export class AppModule { }
