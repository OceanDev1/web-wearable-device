import { SupportFunctionServices } from './../../../utils/supports/function.supports';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DeviceServices } from 'src/app/services/device.service';
import { MqttServices } from 'src/app/services/mqtt.service';
import { PatientServices } from 'src/app/services/patient.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
})
export class PatientComponent implements OnInit {
  list_patients: Array<any> = [];
  list_devices: Array<any> = [];

  account_detail: any = null;
  patient_detail: any = null;

  patient_phone: string = '';
  patient_sex: any = '';
  patient_name: string = '';
  patient_birth: string = '';
  patient_address: string = '';

  patient_height: number = 0;
  patient_tall: number = 0;
  patient_cholesterol: number = 0;
  patient_fastingBS: number = 0;
  patient_ECG: String = '';
  patient_angina: String = '';
  patient_CP: String = '';
  patient_BP: String = '';
  patient_ST: String = '';
  patient_slope_ST: String = '';
  patient_thallium: String = '';

  index_patient_warning: Array<any> = [];

  constructor(
    private authenticationServices: AuthenticationService,
    private toastServices: ToastService,
    private patientServices: PatientServices,
    private supportServices: SupportFunctionServices,
    private mqtt: MqttServices,
    private deviceServices: DeviceServices
  ) {}

  ngOnInit(): void {
    this.getDetailAccount();
    this.getAllPatineManagement();
    this.getAllDeviceManagement();
  }

  getAllDeviceManagement() {
    this.deviceServices.getAllDeviceManagement().subscribe((res) => {
      if (!res['error']) {
        this.list_devices = res.metadata;
        // this.configMqtt();
      } else this.list_devices = [];
    });
  }

  configMqtt() {
    for (let i = 0; i < this.list_patients.length; i++) {
      let devices = this.list_patients[i].pt_devices;
      devices.forEach((e: any) => {
        let topic_receive_message = 'response_data_health/' + e.device_id;

        this.mqtt.receiveMessage(topic_receive_message).subscribe((msg) => {
          const payload = JSON.parse(msg.payload.toString());
          this.updateDataReceive(payload);
        });
      });
    }
    this.configMqttWarning();
  }

  configMqttWarning() {
    this.mqtt.receiveMessage('warning_heart_patient').subscribe((msg) => {
      const payload = JSON.parse(msg.payload.toString());
      if (!!payload) {
        let index_patient = this.list_patients.findIndex(
          (x) => x._id == payload.ml_patient
        );
        let patient = this.list_patients[index_patient];
        if (payload.ml_data_reason.prediction == 'Presence') {
          if (!this.index_patient_warning.includes(patient._id)) {
            this.index_patient_warning.push(patient._id);
            this.toastServices.showToastWarning(
              'Bệnh nhân ' +
                this.list_patients[index_patient].pt_name +
                ' có nguy cơ mắc bệnh tim'
            );
          }
        } else {
          let index_exist = this.index_patient_warning.findIndex(
            (x) => x == patient._id
          );

          if (index_exist != -1)
            this.index_patient_warning.splice(index_exist, 1);
        }
      }
    });
  }

  updateDataReceive(payload: any) {
    let value = payload;
    for (let i = 0; i < this.list_patients.length; i++) {
      let pt_devices = this.list_patients[i].pt_devices;

      const check_device = pt_devices.find(
        (x: any) => x.device_id == value.device_id
      );

      if (!!check_device) {
        let index_patient = i;
        this.list_patients[index_patient].act_body_record.temperature =
          value.value.acr_temperature_human;
        this.list_patients[index_patient].act_body_record.pm =
          this.supportServices.sortDataAir(value.value.acr_air);
        this.list_patients[index_patient].act_body_record.heart =
          value.value.acr_heart;
        this.list_patients[index_patient].act_body_record.sp =
          value.value.acr_spo2;
      }
    }
  }

  removeDeviceInPatient(device_id: any, index: any) {
    const form_data = {
      device_id: device_id,
      patient: this.patient_detail._id,
    };

    this.deviceServices.removeDeviceInAccount(form_data).subscribe((res) => {
      if (!res['error']) {
        this.toastServices.showToastSuccess('Xóa thiết bị thành công');
        this.patient_detail.pt_devices.splice(index, 1);
      } else this.toastServices.showToastError(res['error'].message);
    });
  }

  getDetailAccount() {
    this.authenticationServices.getAccountByToken().subscribe((res) => {
      if (!res['error']) {
        this.account_detail = res.metadata;
        // this.configMqtt();
      } else this.toastServices.showToastError(res['error'].message);
    });
  }

  getAllPatineManagement() {
    this.patientServices.getAllPatientManagement().subscribe((res) => {
      if (!res['error']) {
        let temp_array = [];
        for (let i = 0; i < res.metadata.length; i++) {
          let obj = {
            temperature: 0,
            pm: 0,
            heart: 0,
            sp: 0,
          };
          res.metadata[i].act_body_record = obj;
          temp_array.push(res.metadata[i]);
        }

        this.list_patients = temp_array;

        this.configMqtt();
      } else this.list_patients = [];
    });
  }

  selectSex(event: any) {
    this.patient_sex = event.target.value;
  }

  createNewPatient() {
    const form_data = {
      pt_name: this.patient_name,
      pt_gender: this.patient_sex,
      pt_phone: this.patient_phone,
      pt_address: this.patient_address,
      pt_role: 'patient',
      pt_birth: new Date(this.patient_birth),
    };

    const rules = {
      pt_name: { required: true },
      pt_gender: { required: true },
      pt_phone: { required: true, phone: true },
      pt_address: { required: true },
      pt_role: { required: true },
      pt_birth: { required: true },
    };

    const check = this.supportServices.checkValidationForm(form_data, rules);


    if (check.isValid) {
      this.patientServices.createNewPatient(form_data).subscribe((res) => {
        if (!res['error']) {
          this.toastServices.showToastSuccess('Thêm mới thành công');
          document.getElementById('createPatient')?.click();
          this.resetFormCreatePatient();
          this.getAllPatineManagement();
        } else this.toastServices.showToastError(res['error'].message);
      });
    } else this.toastServices.showErrorValidation(check.errors);
  }

  updatePatient() {
    const form_data = {
      accountId: this.patient_detail['_id'],
      name: this.patient_name,
      heath_data: {
        act_tall: this.patient_tall,
        act_height: this.patient_height,
        act_sex: this.patient_detail['pt_gender'] == 'male' ? '1' : '0',
        act_age: this.calculateYearOld(
          this.patient_detail['pt_birth']
        ).toString(),
        act_cholesterol: this.patient_cholesterol,
        act_fastingBS: this.patient_fastingBS,
        act_chest: this.patient_CP,
        act_BP: this.patient_BP,
        act_ekg: this.patient_ECG,
        act_st: this.patient_ST,
        act_slope_ST: this.patient_slope_ST,
        act_angina: this.patient_angina,
        act_thallium: this.patient_thallium,
        doctor: {
          id: this.account_detail['_id'],
          name: this.account_detail['pt_name'],
          number: this.account_detail['pt_number'],
        },
        timestamps: new Date().getTime(),
      },
    };

    this.patientServices.updateDataHealthPatient(form_data).subscribe((res) => {
      if (!res['error']) {
        this.toastServices.showToastSuccess('Cập nhật thành công');
        this.patient_detail.pt_examinations.push(res.metadata);
        document.getElementById('updateInformationPatient')?.click();
        this.resetFormUpdatePatient();
      } else this.toastServices.showToastError(res['error'].message);
    });
  }

  convertBirthDate(date: any) {
    return this.supportServices.convertDateToDate(date);
  }

  calculateYearOld(birth: any) {
    const yearNow = new Date().getFullYear();
    const yearOld = new Date(birth).getFullYear();

    return yearNow - yearOld;
  }

  selectPatient(patient: any) {
    this.patient_detail = patient;
    this.patient_name = this.patient_detail.pt_name;
  }

  sortDetailDevice(device_id: string) {
    const device = this.list_devices.find((x: any) => x._id == device_id);

    if (!!device) return device.dv_name;
    else '';
  }

  checkValueData(type: any, evt: any) {
    let value = evt.target.value;
    if (type == 'bs') {
      this.patient_fastingBS = value;
    } else if (type == 'ecg') {
      this.patient_ECG = value;
    } else if (type == 'angina') {
      this.patient_angina = value;
    } else if (type == 'cp') {
      this.patient_CP = value;
    } else if (type == 'bp') {
      this.patient_BP = value;
    } else if (type == 'sst') {
      this.patient_slope_ST = value;
    } else if (type == 'thallium') {
      this.patient_thallium = value;
    }
  }

  resetFormCreatePatient() {
    this.patient_phone = '';
    this.patient_sex = '';
    this.patient_name = '';
    this.patient_birth = '';
    this.patient_address = '';
  }

  resetFormUpdatePatient() {
    this.patient_height = 0;
    this.patient_tall = 0;
    this.patient_cholesterol = 0;
    this.patient_fastingBS = 0;
    this.patient_ECG = '';
    this.patient_angina = '';
    this.patient_CP = '';
    this.patient_BP = '';
    this.patient_ST = '';
    this.patient_slope_ST = '';
    this.patient_thallium = '';
  }
}
