import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HealthPageComponent } from './health-page.component';
import { PatientComponent } from './patient/patient.component';
import { DeviceComponent } from './device/device.component';
import { DeviceMonitorComponent } from './device-monitor/device-monitor.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HealthPageComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'patients', component: PatientComponent },
      { path: 'devices', component: DeviceComponent },
      { path: 'device/:id', component: DeviceMonitorComponent },
      { path: 'appointment', component: AppointmentComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthPageRoutingModule {}
