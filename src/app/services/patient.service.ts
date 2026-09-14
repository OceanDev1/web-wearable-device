import { ApiConfigs } from './../../utils/configs/IApi';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PatientServices {
  constructor(private http: HttpClient) {}

  createNewPatient(form_data: any): Observable<any> {
    return this.http
      .post(ApiConfigs.PATIENT.CREATE, form_data, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getAllPatientManagement(): Observable<any> {
    return this.http
      .get(ApiConfigs.PATIENT.GET_ALL_MANAGEMENT, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getHistoryAlarm(accountId:any): Observable<any> {
    return this.http
      .get(ApiConfigs.PATIENT.GET_HISTORY_ALARM + accountId, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getDetailPatient(accountId: string): Observable<any> {
    return this.http
      .get(ApiConfigs.PATIENT.DETAIL + accountId, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  setDeviceForPatient(): Observable<any> {
    return this.http
      .get(ApiConfigs.PATIENT.GET_ALL_MANAGEMENT, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  updateDataHealthPatient(form_data: any): Observable<any> {
    return this.http
      .put(ApiConfigs.PATIENT.UPDATE_DATA_HEALTH, form_data, {
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
