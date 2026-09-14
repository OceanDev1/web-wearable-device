import { ApiConfigs } from './../../utils/configs/IApi';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppointmentServices {
  constructor(private http: HttpClient) {}

  getAppointmentByDoctorAndRangeWeek(form_data: any): Observable<any> {
    return this.http
      .post(ApiConfigs.APPOINTMENT.GET_BY_DOCTOR_AND_RANGE_WEEK, form_data, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  updateStatusAppointment(form_data: any): Observable<any> {
    return this.http
      .put(ApiConfigs.APPOINTMENT.UPDATE_STATUS, form_data, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  addHeaderToken() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': '*',
      Authorization: 'Bearer ' + localStorage.getItem('token_health'),
    });
    return headers;
  }

  addHeaderTokenUpload() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token_health'),
    });
    return headers;
  }
}
