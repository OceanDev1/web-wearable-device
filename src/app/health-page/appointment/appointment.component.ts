import { Component, OnInit } from '@angular/core';
import { AppointmentServices } from 'src/app/services/appointment.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MqttServices } from 'src/app/services/mqtt.service';
import { PatientServices } from 'src/app/services/patient.service';
import { ToastService } from 'src/app/services/toast.service';
import { SupportFunctionServices } from 'src/utils/supports/function.supports';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
  account_detail: any = null;
  list_data_appointment: Array<any> = [];

  data_appointment: any = null;

  current_date: Date = new Date();
  range_date_show: Array<any> = [];

  constructor(
    private supportServices: SupportFunctionServices,
    private appointmentServices: AppointmentServices,
    private toastServices: ToastService,
    private mqttServices: MqttServices,
    private authenticationServices: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.setUpDataAppointment();
    this.getAccountByToken();
  }

  getAccountByToken() {
    this.authenticationServices.getAccountByToken().subscribe((result) => {
      if (!result['error']) {
        this.account_detail = result.metadata;
        this.configMqtt();
      }
    });
  }

  configMqtt() {
    this.mqttServices
      .receiveMessage('topic/send_appointment/' + this.account_detail['_id'])
      .subscribe((msg) => {
        const payload = JSON.parse(msg.payload.toString());
        this.getAppointmentByDoctorAndRangeWeek();
      });
  }

  getAppointmentByDoctorAndRangeWeek() {
    let range_week = [
      this.list_data_appointment[0].date,
      this.list_data_appointment[6].date,
    ];
    this.range_date_show = range_week;

    let form_data = {
      range_week: range_week,
    };

    this.appointmentServices
      .getAppointmentByDoctorAndRangeWeek(form_data)
      .subscribe((result) => {
        if (!result['error']) {
          this.sortDataPatientAppointment(result.metadata);
        }
      });
  }

  showDataAppointment(data: any) {
    let patient = data.patient;
    let data_medical =
      data.patient.pt_examinations[data.patient.pt_examinations.length - 1];
    let obj_information = [
      {
        title: 'Tên bệnh nhân',
        value: patient.pt_name,
      },
      {
        title: 'Năm sinh - Tuổi',
        value:
          this.supportServices.convertDateToDate(patient.pt_birth) +
          ' -- ' +
          this.supportServices.calculateAge(patient.pt_birth) +
          ' tuổi',
      },
      {
        title: 'Giới tính',
        value: patient.pt_gender == 'male' ? 'Nam' : 'Nữ',
      },
      {
        title: 'Số điện thoại',
        value: patient.pt_phone,
      },
      {
        title: 'Địa chỉ',
        value: patient.pt_address,
      },
    ];

    let history_medical = !!data_medical
      ? [
          {
            title: 'Chiều cao - cân nặng',
            value: `${data_medical.act_tall} cm - ${data_medical.act_height} kg`,
          },
          {
            title: 'Huyết áp',
            value: `${data_medical.act_BP} mmHg`,
          },
          {
            title: 'Cholesterol máu',
            value: `${data_medical.act_cholesterol} mm/dl`,
          },
          {
            title: 'Đường huyết lúc đói',
            value:
              data_medical.act_fastingBS == 0
                ? 'Dưới 120 mg/dl'
                : 'Trên 120 mg/dl',
          },
          {
            title: 'Điện tâm đồ',
            value:
              data_medical.act_ekg == '0'
                ? 'Bình thường'
                : data_medical.act_ekg == '1'
                ? 'Có bất thường sóng ST-T'
                : 'LVH',
          },
          {
            title: 'Đău thắt ngực',
            value: data_medical.act_angina == '0' ? 'Không' : 'Có',
          },
          {
            title: 'Đău ngực (Chest paint)',
            value:
              data_medical.act_chest == '1'
                ? 'Typical angina'
                : data_medical.act_chest == '2'
                ? 'Atypical Angina'
                : data_medical.act_chest == '3'
                ? 'Non-anginal Pain'
                : data_medical.act_chest == '4'
                ? 'Asymptomatic'
                : '',
          },
          {
            title: 'Bác sĩ khám',
            value: `${data_medical.doctor.number} - ${data_medical.doctor.name}`,
          },
          {
            title: 'Ngày khám gần nhất',
            value:
              this.supportServices.convertDateToDate(data_medical.timestamps) +
              ' - ' +
              this.supportServices.calculateDaysUntil(data_medical.timestamps) +
              ' ngày trước',
          },
        ]
      : [
          {
            title: 'Chưa có lịch sử khám',
            value: '',
          },
        ];

    this.data_appointment = {
      ap_id: data.id,
      data_patients: obj_information,
      data_medical: history_medical,
      time_appointment: data.time + ':00',
      status: data.status,
      date_appointment: this.supportServices.convertDateToDate(data.date),
    };
  }

  updateStatusAp(data_ap: any) {
    const form_data = {
      appointmentId: data_ap.ap_id,
      status: 1,
    };

    this.appointmentServices
      .updateStatusAppointment(form_data)
      .subscribe((result) => {
        if (!result['error']) {
          this.toastServices.showToastSuccess('Thao tác thành công');
          this.data_appointment.status = 1;
          this.getAppointmentByDoctorAndRangeWeek();
        } else this.toastServices.showToastError(result['error'].message);
      });
  }
  prevNextDateWeek(type: any) {
    if (type == 'prev') {
      this.current_date.setDate(this.current_date.getDate() - 7);
      this.setUpDataAppointment();
    }

    if (type == 'next') {
      this.current_date.setDate(this.current_date.getDate() + 7);
      this.setUpDataAppointment();
    }
  }

  setUpDate() {
    let current = this.current_date;

    const weekDays = [];

    // Calculate the date of the Monday of the current week
    const dayOfWeek = current.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const monday = new Date(current.setDate(current.getDate() + diffToMonday));

    const daysOfWeek = [
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
      'Chủ nhật',
    ];

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push({
        day: daysOfWeek[i],
        date: this.supportServices.formatDateRangeWeek(day),
        morning: [],
        afternoon: [],
      });
    }

    return weekDays;
  }

  setUpDataAppointment() {
    this.list_data_appointment = this.setUpDate();

    this.getAppointmentByDoctorAndRangeWeek();
  }

  resetDataApEachDate() {
    this.list_data_appointment.forEach((e) => {
      e.morning = [];
      e.afternoon = [];
    });
  }

  sortDataPatientAppointment(list_ap: any) {
    this.resetDataApEachDate();
    for (let i = 0; i < list_ap.length; i++) {
      let data = list_ap[i];
      let date = this.supportServices.formatDateRangeWeek(
        new Date(data.ap_date)
      );
      const index_appointment = this.list_data_appointment.findIndex(
        (x: any) => x.date == date
      );
      const obj_ap = {
        id: data._id,
        patient: data.ap_patient,
        time: data.ap_time,
        status: data.ap_status,
        date: data.ap_date,
      };

      if (Number.parseInt(data.ap_time) < 12) {
        this.list_data_appointment[index_appointment].morning.push(obj_ap);
      } else
        this.list_data_appointment[index_appointment].afternoon.push(obj_ap);
    }
  }
}
