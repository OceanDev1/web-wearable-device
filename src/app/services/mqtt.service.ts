import { Injectable } from '@angular/core';
import { IMqttMessage, MqttConnectionState, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MqttServices {
  public client = null;
  subscription: Subscription = new Subscription;

  constructor(private _mqttService: MqttService) {}

  checkConnectMqtt() {
    this._mqttService.state.subscribe((s: MqttConnectionState): void => {
      const status =
        s === MqttConnectionState.CONNECTED ? 'CONNECTED' : 'DISCONNECTED';
    });
  }

  connect() {
    console.log('mqtt connecting');

    this._mqttService.connect();
  }

  public sendMessage(message:any) {
    this._mqttService.publish('topic', message);
  }

  public receiveMessage(homeId:any): Observable<any> {
    console.log('Receive message mqtt', homeId);
    return this._mqttService.observeRetained(homeId).pipe(
      catchError((err) => {
        return of(err || []);
      })
    );
  }

  public cancelReceiveMessage() {
    console.log('mqtt disconnect');
    this._mqttService.disconnect(true);
  }

}
