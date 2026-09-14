import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MqttServices } from 'src/app/services/mqtt.service';
import { ToastService } from 'src/app/services/toast.service';
import * as ApexCharts from 'apexcharts';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceServices } from 'src/app/services/device.service';
import { SupportFunctionServices } from 'src/utils/supports/function.supports';
import { IFunctionErrorCheck } from 'src/utils/supports/function.error';
import { PatientServices } from 'src/app/services/patient.service';

@Component({
  selector: 'app-device-monitor',
  templateUrl: './device-monitor.component.html',
  styleUrls: ['./device-monitor.component.scss'],
})
export class DeviceMonitorComponent implements OnInit {
  device_id: string = '';
  account_detail: any = null;
  device_detail: any = null;
  account_using_detail: any = null;

  account_using_information: Array<any> = [];
  account_using_data_health: Array<any> = [];

  list_account_alarms: Array<any> = [];
  list_data_alarms: Array<any> = [];

  data_heart: Array<any> = [];
  data_motion: Array<any> = [];
  data_sound: Array<any> = [];
  data_sp02: Array<any> = [];
  data_temperature: Array<any> = [];
  environment_temperature: any = 0;

  data_air: any = 0;
  time_used_device: any = 0;

  data_motion_xAcc: Array<any> = [];
  data_motion_yAcc: Array<any> = [];
  data_motion_zAcc: Array<any> = [];
  data_motion_xGyro: Array<any> = [];
  data_motion_yGyro: Array<any> = [];
  data_motion_zGyro: Array<any> = [];

  address_account_form: String = '';
  type_account_form: String = '';

  chart_heart: any = null;
  chart_motion: any = null;
  chart_sp02: any = null;
  chart_temperature: any = null;
  chart_sound: any = null;

  device_specifications: any = null;
  data_examinations: any = [];
  type_show_data_alarm: any = '';

  timeout_detect_cough: any = null;
  detect_cough: boolean = false;

  data_evaluation: any = {};
  data_show_evaluation: any = null;

  data_predict = [
    { title: 'Bệnh', value: '' },
    { title: 'Nồng độ Oxy trong máu', value: '' },
    { title: 'Chất lượng không khí', value: '' },
    { title: 'Vận động', value: '' },
  ];

  constructor(
    private mqtt: MqttServices,
    private authenticationServices: AuthenticationService,
    private toastServices: ToastService,
    private router: Router,
    private deviceServices: DeviceServices,
    private patientServices: PatientServices,
    private functionSupportServices: SupportFunctionServices
  ) {}

  ngOnInit(): void {
    this.device_id = this.router.url.split('/')[3];
    this.getFullDetailDevice();
    this.getDetailAccount();
  }

  ngOnDestroy() {
    this.data_air = [];
    this.data_heart = [];
    this.data_motion = [];
    this.data_sound = [];
    this.data_temperature = [];
    this.chart_heart.destroy();
    this.chart_motion.destroy();
    // this.chart_sound.destroy();
    this.chart_sp02.destroy();
    this.chart_temperature.destroy();
  }

  getFullDetailDevice() {
    this.deviceServices.getFullDetailDevice(this.device_id).subscribe((res) => {
      if (!res['error']) {
        this.device_detail = res.metadata;
        this.list_account_alarms = this.device_detail.dv_account_alarm;
        this.account_using_detail = this.device_detail.patient;
        this.getHistoryAlarm();
        this.sortDataAccountUsing();
        setTimeout(() => {
          this.getDataReadingFirst();
        }, 1000);
        this.configMqtt();
      } else this.device_detail = null;
    });
  }

  getHistoryAlarm() {
    this.patientServices
      .getHistoryAlarm(this.account_using_detail._id)
      .subscribe((result) => {
        if (!result['error']) {
          this.list_data_alarms = result.metadata;
        } else this.list_data_alarms = [];
      });
  }

  getDataReadingFirst() {
    this.deviceServices
      .getReadingRecordFirst(this.device_id, this.account_using_detail._id)
      .subscribe((result) => {
        if (!result['error']) {
          this.data_heart = result.metadata.heart;
          this.data_sp02 = result.metadata.spo2;
          this.data_temperature = result.metadata.temperature;

          if (!!this.chart_heart && !!this.chart_motion && !!this.chart_sp02) {
            this.chart_heart.updateSeries([{ data: this.data_heart }]);
            this.chart_sp02.updateSeries([{ data: this.data_sp02 }]);
            this.chart_temperature.updateSeries([
              { data: this.data_temperature },
            ]);
          }
        } else {
          this.data_heart = [];
          this.data_sp02 = [];
          this.data_temperature = [];
        }
      });
  }

  sortDataAccountUsing() {
    if (!!this.account_using_detail) {
      this.account_using_information = [
        {
          title: 'Mã bệnh nhân',
          value: this.account_using_detail.pt_number,
        },
        {
          title: 'Họ và tên',
          value: this.account_using_detail.pt_name,
        },
        {
          title: 'Ngày sinh',
          value: this.account_using_detail.pt_birth,
        },
        {
          title: 'Giới tính',
          value: this.account_using_detail.pt_gender,
        },
      ];

      let data_health = this.account_using_detail.pt_examinations.reverse()[0];

      if (!!data_health) {
        this.account_using_data_health = [
          {
            title: 'Chiều cao - cân nặng',
            value:
              data_health.act_tall + 'cm - ' + data_health.act_height + 'kg',
          },
          {
            title: 'Huyết áp',
            value: data_health.act_BP + 'mmHg',
          },
          {
            title: 'Cholesterol máu',
            value: data_health.act_cholesterol + 'mm/dl',
          },
          {
            title: 'Đường huyết lúc đói',
            value:
              data_health.act_fastingBS == 0
                ? 'Dưới 120 mg/dl'
                : 'Trên 120 mg/dl',
          },
          {
            title: 'Điện tâm đồ',
            value:
              data_health.act_ekg == '0'
                ? 'Bình thường'
                : data_health.act_ekg == '1'
                ? 'Có bất thường sóng ST-T'
                : 'LVH',
          },
          {
            title: 'Đău thắt ngực',
            value: data_health.act_angina == '0' ? 'Không' : 'Có',
          },
          {
            title: 'Đău ngực (Chest paint)',
            value:
              data_health.act_chest == '1'
                ? 'Typical angina'
                : data_health.act_chest == '2'
                ? 'Atypical Angina'
                : data_health.act_chest == '3'
                ? 'Non-anginal Pain'
                : data_health.act_chest == '4'
                ? 'Asymptomatic'
                : '',
          },
          {
            title: 'Bác sĩ khám',
            value: data_health.doctor.number + '-' + data_health.doctor.name,
          },
        ];
      }
    }
  }

  ngAfterViewInit(): void {
    this.renderChartHeart();
    this.renderChartSp02();
    this.renderChartTemperature();
    this.renderChartMotion();
    // this.renderChartSound();
  }

  restartDevice() {
    this.deviceServices
      .restartDevice(this.device_detail.dv_mac_address)
      .subscribe((result) => {
        if (!result['error']) {
          this.toastServices.showToastSuccess(
            'Khởi động lại thiết bị thành công'
          );
        } else this.toastServices.showToastError(result['error'].message);
      });
  }

  sortDataEvaluation(type: any, value: any) {
    if (type == 'heart') {
      let data = this.functionSupportServices.sortDataEvaluationHeart(value);

      if (!!data) {
        return data;
      }
    }

    if (type == 'spo2') {
      let data = this.functionSupportServices.sortDataEvaluationSpo2(value);

      if (!!data) {
        return data;
      }
    }

    if (type == 'human_temp' && !!value) {
      let data =
        this.functionSupportServices.sortDataEvaluationHumanTemperature(
          value[0]
        );

      if (!!data) {
        return data;
      }
    }

    if (type == 'environment_temp' && !!value) {
      let data =
        this.functionSupportServices.sortDataEvaluationEnvironmentTemperature(
          value[1]
        );

      if (!!data) {
        return data;
      }
    }

    return {
      value: 0,
      title: 'Bình thường',
      class_txt: 'txt_success',
      risk: [],
      suggestions: [],
    };
  }

  showDataEvaluation(type: any, value: any) {
    if (type == 'heart') {
      let data = this.functionSupportServices.sortDataEvaluationHeart(value);

      if (!!data) return (this.data_show_evaluation = data);
    }

    if (type == 'spo2') {
      let data = this.functionSupportServices.sortDataEvaluationSpo2(value);
      if (!!data) return (this.data_show_evaluation = data);
    }

    if (type == 'human_temp' && !!value) {
      let data =
        this.functionSupportServices.sortDataEvaluationHumanTemperature(
          value[0]
        );

      if (!!data) return (this.data_show_evaluation = data);
    }

    if (type == 'environment_temp' && !!value) {
      let data =
        this.functionSupportServices.sortDataEvaluationEnvironmentTemperature(
          value[1]
        );

      if (!!data) return (this.data_show_evaluation = data);
    }

    return null;
  }

  getDetailAccount() {
    this.authenticationServices.getAccountByToken().subscribe((res) => {
      if (!res['error']) {
        this.account_detail = res.metadata;
      } else this.toastServices.showToastError(res['error'].message);
    });
  }

  configMqtt() {
    // Sound
    this.mqtt
      .receiveMessage('response_data_sound/' + this.device_detail._id)
      .subscribe((msg) => {
        const payload = JSON.parse(msg.payload.toString());

        return this.updateDataSound(payload);
      });

    // Battery
    this.mqtt
      .receiveMessage('battery_esp/' + this.device_detail.dv_mac_address)
      .subscribe((msg) => {
        const payload = JSON.parse(msg.payload.toString());
        this.time_used_device = payload.bt_time_used;
      });

    // Health
    this.mqtt
      .receiveMessage('response_data_health/' + this.device_detail._id)
      .subscribe((msg) => {
        const payload = JSON.parse(msg.payload.toString());

        return this.updateDataReceive(payload);
      });

    // MOTION
    this.mqtt
      .receiveMessage('response_data_motion/' + this.device_detail._id)
      .subscribe((msg) => {
        const payload = JSON.parse(msg.payload.toString());

        if (payload.device_id == this.device_id) {
          return this.updateDataMotionReceive(payload);
        }
      });

    // PREDICT
    this.mqtt
      .receiveMessage(
        'response_predict_health/' + this.device_detail.dv_mac_address
      )
      .subscribe((msg) => {
        const payload = JSON.parse(msg.payload.toString());
        this.data_evaluation = payload.value;
        console.log('data_evaluation', this.data_evaluation);
        this.environment_temperature =
          payload.value.value_environment_temperature;
        this.data_predict[0].value = this.sortDataHeart(
          payload.value.prediction
        );
        this.data_predict[1].value = this.sortDataSpo02(
          payload.value.prediction_spo2
        );
        this.data_predict[2].value = this.sortDataAir(payload.value.value_pm);
      });

    this.mqtt
      .receiveMessage(
        'response_predict_motion/' + this.device_detail.dv_mac_address
      )
      .subscribe((msg) => {
        const payload = JSON.parse(msg.payload.toString());

        // if (payload.device_id == this.device_id) {
        this.data_predict[3].value = this.sortDataMotion(
          payload.value.prediction
        );
        // }
      });

    this.mqtt
      .receiveMessage(
        'response_predict_sound/' + this.device_detail.dv_mac_address
      )
      .subscribe((msg) => {
        const payload = JSON.parse(msg.payload.toString());
        let value = payload.value;
        clearTimeout(this.timeout_detect_cough);

        if (value.prediction == 'cough_detection') {
          this.detect_cough = true;

          setTimeout(() => {
            this.detect_cough = false;
          }, 5000);
        }

        // {
        //   mac_address: "3C:E9:0E:AD:C3:EC",
        //   prediction: "cough_detection",
        //   type: "sound"
        // }

        // if (payload.device_id == this.device_id) {
        // this.data_predict[3].value = this.sortDataMotion(
        //   payload.value.prediction
        // );
        // }
      });
  }

  showDataAlarm(alarm: any) {
    this.type_show_data_alarm = alarm.ml_reasons;

    if (alarm.ml_reasons != 'predict_fall') {
      this.deviceServices.getDataAlarm(alarm._id).subscribe((result) => {
        if (!result['error']) {
          this.device_specifications = result.metadata.reason;
          let data_health = result.metadata.examinations;

          this.data_examinations = [
            {
              title: 'Chiều cao - cân nặng',
              value:
                data_health.act_tall + 'cm - ' + data_health.act_height + 'kg',
            },
            {
              title: 'Huyết áp',
              value: data_health.act_BP + 'mmHg',
            },
            {
              title: 'Cholesterol máu',
              value: data_health.act_cholesterol + 'mm/dl',
            },
            {
              title: 'Đường huyết lúc đói',
              value:
                data_health.act_fastingBS == 0
                  ? 'Dưới 120 mg/dl'
                  : 'Trên 120 mg/dl',
            },
            {
              title: 'Điện tâm đồ',
              value:
                data_health.act_ekg == '0'
                  ? 'Bình thường'
                  : data_health.act_ekg == '1'
                  ? 'Có bất thường sóng ST-T'
                  : 'LVH',
            },
            {
              title: 'Đău thắt ngực',
              value: data_health.act_angina == '0' ? 'Không' : 'Có',
            },
            {
              title: 'Đău ngực (Chest paint)',
              value:
                data_health.act_chest == '1'
                  ? 'Typical angina'
                  : data_health.act_chest == '2'
                  ? 'Atypical Angina'
                  : data_health.act_chest == '3'
                  ? 'Non-anginal Pain'
                  : data_health.act_chest == '4'
                  ? 'Asymptomatic'
                  : '',
            },
            {
              title: 'Bác sĩ khám',
              value: data_health.doctor.number + '-' + data_health.doctor.name,
            },
          ];
        }
      });
    }
  }

  sortDataAir(air: any) {
    return this.functionSupportServices.sortDataAir(air);
  }

  updateDataSound(payload: any) {
    this.data_sound = payload.value;
    // this.chart_sound.updateSeries([{ data: this.data_sound }]);
  }

  updateDataReceive(payload: any) {
    let value = payload.value;
    this.data_air = value.acr_air;
    if (this.data_temperature.length == 100) {
      this.data_temperature.shift();
    }

    if (this.data_heart.length == 100) {
      this.data_heart.shift();
    }
    if (this.data_sp02.length == 100) {
      this.data_sp02.shift();
    }

    this.data_temperature.push(Number.parseFloat(value.acr_temperature_human));
    this.data_heart.push(Number.parseInt(value.acr_heart));
    this.data_sp02.push(Number.parseInt(value.acr_spo2));

    this.chart_heart.updateSeries([{ data: this.data_heart }]);
    this.chart_sp02.updateSeries([{ data: this.data_sp02 }]);
    this.chart_temperature.updateSeries([{ data: this.data_temperature }]);
  }

  updateDataMotionReceive(payload: any) {
    let value = payload.value;
    if (this.data_motion_xAcc.length == 100) {
      this.data_motion_xAcc.shift();
      this.data_motion_yAcc.shift();
      this.data_motion_zAcc.shift();
      this.data_motion_xGyro.shift();
      this.data_motion_yGyro.shift();
      this.data_motion_zGyro.shift();
    }

    this.data_motion_xAcc.push(Number.parseFloat(value.xAcc));
    this.data_motion_yAcc.push(Number.parseFloat(value.yAcc));
    this.data_motion_zAcc.push(Number.parseFloat(value.zAcc));
    this.data_motion_xGyro.push(Number.parseFloat(value.xGyro));
    this.data_motion_yGyro.push(Number.parseFloat(value.yGyro));
    this.data_motion_zGyro.push(Number.parseFloat(value.zGyro));

    this.chart_motion.updateSeries([
      { data: this.data_motion_xAcc },
      { data: this.data_motion_yAcc },
      { data: this.data_motion_zAcc },
      { data: this.data_motion_xGyro },
      { data: this.data_motion_yGyro },
      { data: this.data_motion_zGyro },
    ]);
  }

  sortDataMotion(motion: any) {
    return this.functionSupportServices.sortDataMotion(motion);
  }

  selectTypeAlarm(type: any) {
    this.type_account_form = type;
  }

  settingAlarmPersonal() {
    const rules = {
      device: { required: true },
      type_account: { required: true },
      address_account:
        this.type_account_form == 'email'
          ? { required: true, email: true }
          : { required: true, phone: true },
    };

    const form_data = {
      device: this.device_id,
      type_account: this.type_account_form,
      address_account: this.address_account_form,
    };

    const check = IFunctionErrorCheck.checkValidationForm(form_data, rules);

    if (check.isValid) {
      this.deviceServices.settingAccountAlarm(form_data).subscribe((result) => {
        if (!result['error']) {
          this.type_account_form = '';
          this.address_account_form = '';
          this.toastServices.showToastSuccess('Cập nhật thành công');
          this.list_account_alarms.push(result.metadata);
          document.getElementById('settingAccountAlarm')?.click();
        } else this.toastServices.showToastError(result['error'].message);
      });
    } else this.toastServices.showErrorValidation(check.errors);
  }

  removeAccountAlarm(item: any, index: number) {
    const form_data = {
      device: this.device_id,
      ...item,
    };

    this.deviceServices.removeAccountAlarm(form_data).subscribe((result) => {
      if (!result['error']) {
        this.list_account_alarms.splice(index, 1);
        this.toastServices.showToastSuccess('Cập nhật thành công');
      } else this.toastServices.showToastError(result['error'].message);
    });
  }

  sortDataHeart(heart: any) {
    return this.functionSupportServices.sortDataHeart(heart);
  }

  sortDataSpo02(data: any) {
    return this.functionSupportServices.sortDataSp02(data);
  }

  renderChartSound() {
    let options = {
      series: [
        {
          name: 'Sound',
          data: this.data_sound,
        },
      ],
      chart: {
        height: '100%',
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 1,
      },
      // title: {
      //   text: 'Product Trends by Month',
      //   align: 'left',
      // },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
    };
    this.chart_sound = new ApexCharts(
      document.querySelector('#chartSound'),
      options
    );

    // this.chart_sound.render();
  }

  renderChartMotion() {
    let options = {
      series: [
        {
          name: 'xAcc',
          data: this.data_motion_xAcc,
        },
        {
          name: 'yAcc',
          data: this.data_motion_yAcc,
        },
        {
          name: 'zAcc',
          data: this.data_motion_zAcc,
        },
        {
          name: 'xGyro',
          data: this.data_motion_xGyro,
        },
        {
          name: 'yGyro',
          data: this.data_motion_yGyro,
        },
        {
          name: 'zGyro',
          data: this.data_motion_zGyro,
        },
      ],
      chart: {
        height: '100%',
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 1,
      },
      // title: {
      //   text: 'Product Trends by Month',
      //   align: 'left',
      // },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
    };
    this.chart_motion = new ApexCharts(
      document.querySelector('#chartMotion'),
      options
    );
    this.chart_motion.render();
  }

  renderChartHeart() {
    let options = {
      series: [
        {
          name: 'Heart Rate (bpm)',
          data: this.data_heart,
        },
      ],
      chart: {
        height: '100%',
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 1,
      },
      // title: {
      //   text: 'Product Trends by Month',
      //   align: 'left',
      // },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
        // categories: [
        //   'Jan',
        //   'Feb',
        //   'Mar',
        //   'Apr',
        //   'May',
        //   'Jun',
        //   'Jul',
        //   'Aug',
        //   'Sep',
        // ],
      },
    };
    this.chart_heart = new ApexCharts(
      document.querySelector('#chartHeart'),
      options
    );

    this.chart_heart.render();
  }

  renderChartSp02() {
    let options = {
      series: [
        {
          name: 'Heart Rate (bpm)',
          data: this.data_sp02,
        },
      ],
      chart: {
        height: '100%',
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 1,
      },
      // title: {
      //   text: 'Product Trends by Month',
      //   align: 'left',
      // },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
        // categories: [
        //   'Jan',
        //   'Feb',
        //   'Mar',
        //   'Apr',
        //   'May',
        //   'Jun',
        //   'Jul',
        //   'Aug',
        //   'Sep',
        // ],
      },
    };
    this.chart_sp02 = new ApexCharts(
      document.querySelector('#chartSp02'),
      options
    );

    this.chart_sp02.render();
  }

  renderChartTemperature() {
    let options = {
      series: [
        {
          name: '°C',
          data: this.data_temperature,
        },
      ],
      chart: {
        height: '100%',
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 1,
      },
      // title: {
      //   text: 'Product Trends by Month',
      //   align: 'left',
      // },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
    };
    this.chart_temperature = new ApexCharts(
      document.querySelector('#chartTemperature'),
      options
    );

    this.chart_temperature.render();
  }
}
