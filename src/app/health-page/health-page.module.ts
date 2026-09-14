import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HealthPageComponent } from './health-page.component';
import { HealthPageRoutingModule } from './health-page.routing';
import { PatientComponent } from './patient/patient.component';
import { DeviceComponent } from './device/device.component';
import { DeviceMonitorComponent } from './device-monitor/device-monitor.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
   HealthPageComponent,
   PatientComponent,
   DeviceComponent,
   DeviceMonitorComponent,
   AppointmentComponent,
   DashboardComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    HealthPageRoutingModule
  ],
  providers: [],
})
export class AuthenticationModule {}

