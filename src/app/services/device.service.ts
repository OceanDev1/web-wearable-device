import { ApiConfigs } from './../../utils/configs/IApi';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeviceServices {
  constructor(private http: HttpClient) {}

  getAllDeviceManagement(): Observable<any> {
    return this.http
      .get(ApiConfigs.DEVICE.GET_MANAGEMENT, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  setDeviceForPatient(form_data: any): Observable<any> {
    return this.http
      .put(ApiConfigs.DEVICE.SET_FOR_ACCOUNT, form_data, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getDataAlarm(alarmId: any): Observable<any> {
    return this.http
      .get(ApiConfigs.DEVICE.GET_DATA_ALARM + alarmId, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getFullDetailDevice(device_id: any): Observable<any> {
    return this.http
      .get(ApiConfigs.DEVICE.FULL_DETAIL + device_id, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  settingAccountAlarm(form_data: any): Observable<any> {
    return this.http
      .post(ApiConfigs.DEVICE.SETTING_ACCOUNT_ALARM, form_data, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  removeAccountAlarm(form_data: any): Observable<any> {
    return this.http
      .put(ApiConfigs.DEVICE.REMOVE_ACCOUNT_ALARM, form_data, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  restartDevice(mac: any): Observable<any> {
    return this.http
      .get(ApiConfigs.DEVICE.RESTART + mac, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  removeDeviceInAccount(form_data: any): Observable<any> {
    return this.http
      .put(ApiConfigs.DEVICE.REMOVE_IN_ACCOUNT, form_data, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getReadingRecordFirst(device_id: any, patient_id: any): Observable<any> {
    return this.http
      .get(
        ApiConfigs.READING.GET_FIRST + device_id + '&patientId=' + patient_id,
        {
          headers: this.addHeaderToken(),
        }
      )
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
