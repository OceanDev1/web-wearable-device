import { ApiConfigs } from './../../utils/configs/IApi';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  loginAccount(form_data: any): Observable<any> {
    return this.http.post(ApiConfigs.AUTHENTICATION.LOGIN, form_data).pipe(
      catchError((err) => {
        return of(err);
      })
    );
  }

  getDataDashboard(timestamp: any): Observable<any> {
    return this.http
      .get(ApiConfigs.AUTHENTICATION.GET_DATA_DASHBOARD + timestamp, {
        headers: this.addHeaderToken(),
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getAccountByToken(): Observable<any> {
    return this.http
      .get(ApiConfigs.AUTHENTICATION.GET_BY_TOKEN, {
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
