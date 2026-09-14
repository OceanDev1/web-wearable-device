import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DeviceServices } from 'src/app/services/device.service';
import { MqttServices } from 'src/app/services/mqtt.service';
import { PatientServices } from 'src/app/services/patient.service';
import { ToastService } from 'src/app/services/toast.service';
import { SupportFunctionServices } from 'src/utils/supports/function.supports';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
})
export class DeviceComponent implements OnInit {
  list_patients: Array<any> = [];
  list_devices: Array<any> = [];
  list_devices_history: Array<any> = [];

  account_detail: any = null;

  device_selected: any = null;

  serial_device_form: string = '';
  patient_form: any = null;

  constructor(
    private authenticationServices: AuthenticationService,
    private toastServices: ToastService,
    private patientServices: PatientServices,
    private supportServices: SupportFunctionServices,
    private deviceServices: DeviceServices,
    private router: Router,
    private mqtt: MqttServices
  ) {}
  ngOnInit(): void {
    this.getDetailAccount();
    this.getAllPatineManagement();
  }

  configMqtt() {
    this.mqtt
      .receiveMessage('response_data_health/' + this.account_detail['_id'])
      .subscribe((msg) => {
        const payload = JSON.parse(msg.payload.toString());
      });
  }

  getAllDeviceManagement() {
    this.deviceServices.getAllDeviceManagement().subscribe((res) => {
      if (!res['error']) this.list_devices = res.metadata;
      else this.list_devices = [];
    });
  }

  sortPatientUsing(deviceId: any) {
    let patient_using = '';

    for (let i = 0; i < this.list_patients.length; i++) {
      let data_devices = this.list_patients[i].pt_devices;
      const check = data_devices.find((x: any) => x.device_id == deviceId);
      if (!!check) {
        patient_using += this.list_patients[i].pt_name;
      }
    }
    if (patient_using == '') patient_using = 'Chưa sử dụng';

    return patient_using;
  }

  getDetailAccount() {
    this.authenticationServices.getAccountByToken().subscribe((res) => {
      if (!res['error']) {
        this.account_detail = res.metadata;
      } else this.toastServices.showToastError(res['error'].message);
    });
  }

  getAllPatineManagement() {
    this.patientServices.getAllPatientManagement().subscribe((res) => {
      if (!res['error']) {
        this.list_patients = res.metadata;
        this.getAllDeviceManagement();
      } else this.list_patients = [];
    });
  }

  setPatineForDevice() {
    const form_data = {
      device_id: this.device_selected['_id'],
      account_id: this.patient_form,
    };

    this.deviceServices.setDeviceForPatient(form_data).subscribe((res) => {
      if (!res['error']) {
        document.getElementById('createDevice')?.click();
        this.toastServices.showToastSuccess('Thao tác thành công');
        this.serial_device_form = '';
        this.patient_form = null;
      } else this.toastServices.showToastError(res['error'].message);
    });
  }

  selectDevice(item: any) {
    this.device_selected = item;
  }

  sortPatientDevice(deviceId: string) {
    const data = this.list_patients.find((x) => x);
    // const patient = this.list_patients.find((x) => x._id == patientId);

    // if (!!patient) return patient.act_number + ' - ' + patient.act_name;
    // else return '';
    return 'Chưa sử dụng';
  }

  showMonitorDevice(device: any) {
    this.router.navigate(['/health-page/device/', device._id]);
  }

  selectPatient(evt: any) {
    this.patient_form = evt.target.value;
  }

  sortNamePatient(id:any) {
    const item = this.list_patients.find((x:any) => x._id ==id);

    if(!!item) return item.pt_name;
    else return ''
  }

  showHistoryUsing(item: any) {
    this.list_devices_history = item.dv_history_using
  }
}
