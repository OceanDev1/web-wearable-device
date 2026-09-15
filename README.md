# Client Health Wearable

Ứng dụng web quản lý và giám sát thiết bị đeo theo dõi sức khỏe (wearable device), xây dựng bằng [Angular](https://angular.io/) 13. Ứng dụng kết nối thiết bị qua giao thức MQTT để nhận dữ liệu theo thời gian thực, đồng thời cung cấp giao diện quản lý bệnh nhân, lịch hẹn và trực quan hóa dữ liệu sức khỏe.

## Tính năng chính

- **Xác thực người dùng**: đăng nhập, quản lý phiên làm việc.
- **Dashboard**: trực quan hóa dữ liệu sức khỏe bằng biểu đồ ([ApexCharts](https://apexcharts.com/)).
- **Quản lý bệnh nhân** (`patient`): xem, thêm, cập nhật thông tin bệnh nhân.
- **Quản lý lịch hẹn** (`appointment`): tạo và theo dõi lịch hẹn khám.
- **Quản lý & giám sát thiết bị** (`device`, `device-monitor`): theo dõi trạng thái thiết bị đeo và dữ liệu gửi về theo thời gian thực qua MQTT ([ngx-mqtt](https://github.com/sclaire/ngx-mqtt)).
- **Thông báo**: hiển thị thông báo hệ thống bằng [ngx-toastr](https://github.com/scttcper/ngx-toastr).

## Yêu cầu môi trường

- [Node.js](https://nodejs.org/) (khuyến nghị bản LTS tương thích Angular 13)
- [Angular CLI](https://angular.io/cli) `13.1.2`

```bash
npm install -g @angular/cli@13.1.2
```

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng (development)

```bash
npm start
```

Hoặc:

```bash
ng serve
```

Sau đó truy cập `http://localhost:4200/`. Ứng dụng sẽ tự động tải lại khi có thay đổi trong mã nguồn.

## Cấu hình môi trường

File cấu hình nằm tại `src/environments/`:

- `environment.ts`: dùng cho môi trường development.
- `environment.prod.ts`: dùng cho môi trường production (tự động thay thế khi build với `--configuration production`).

Cấu hình kết nối MQTT, API backend... cần được khai báo trong các file này trước khi chạy hoặc build ứng dụng.

## Cấu trúc thư mục

```
src/app
├── authentication/       # Đăng nhập, xác thực người dùng
├── health-page/
│   ├── dashboard/         # Trang tổng quan, biểu đồ dữ liệu sức khỏe
│   ├── patient/           # Quản lý bệnh nhân
│   ├── appointment/       # Quản lý lịch hẹn
│   ├── device/             # Quản lý thiết bị
│   └── device-monitor/    # Giám sát dữ liệu thiết bị theo thời gian thực
├── services/              # Các service gọi API, MQTT, toast...
└── utils/                 # Hàm hỗ trợ, cấu hình dùng chung
```

## Build

```bash
ng build
```

Kết quả build được lưu trong thư mục `dist/`.

## Chạy unit test

```bash
npm test
```

Chạy test bằng [Karma](https://karma-runner.github.io).

## Tham khảo thêm

Xem thêm tại [Angular CLI Overview and Command Reference](https://angular.io/cli) hoặc chạy `ng help`.

---

# English

A web application for managing and monitoring wearable health devices, built with [Angular](https://angular.io/) 13. The app connects to devices over MQTT to receive real-time data, and provides an interface for managing patients, appointments, and visualizing health data.

## Key Features

- **Authentication**: user login and session management.
- **Dashboard**: health data visualization with charts ([ApexCharts](https://apexcharts.com/)).
- **Patient management** (`patient`): view, add, and update patient information.
- **Appointment management** (`appointment`): create and track appointments.
- **Device management & monitoring** (`device`, `device-monitor`): track device status and real-time data via MQTT ([ngx-mqtt](https://github.com/sclaire/ngx-mqtt)).
- **Notifications**: system notifications via [ngx-toastr](https://github.com/scttcper/ngx-toastr).

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version compatible with Angular 13 recommended)
- [Angular CLI](https://angular.io/cli) `13.1.2`

```bash
npm install -g @angular/cli@13.1.2
```

## Installation

```bash
npm install
```

## Running the app (development)

```bash
npm start
```

Or:

```bash
ng serve
```

Then navigate to `http://localhost:4200/`. The app will automatically reload when you change source files.

## Environment configuration

Configuration files are located in `src/environments/`:

- `environment.ts`: used for the development environment.
- `environment.prod.ts`: used for production (automatically substituted when building with `--configuration production`).

MQTT connection settings, backend API URLs, etc. must be configured in these files before running or building the app.

## Project structure

```
src/app
├── authentication/       # Login, user authentication
├── health-page/
│   ├── dashboard/         # Overview page, health data charts
│   ├── patient/           # Patient management
│   ├── appointment/       # Appointment management
│   ├── device/             # Device management
│   └── device-monitor/    # Real-time device data monitoring
├── services/              # API, MQTT, toast services
└── utils/                 # Shared helpers and configuration
```

## Build

```bash
ng build
```

Build artifacts are stored in the `dist/` directory.

## Running unit tests

```bash
npm test
```

Runs tests via [Karma](https://karma-runner.github.io).

## Further help

See the [Angular CLI Overview and Command Reference](https://angular.io/cli) page, or run `ng help`.
