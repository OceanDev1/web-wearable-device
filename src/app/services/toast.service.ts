import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  title_toast = '';
  array_errors: any = [];

  constructor(private toastService: ToastrService) {}

  showToastSuccess(message: any): void {
    this.toastService.show(message, 'Thành công', {
      toastClass: 'toast_global toast_success',
      titleClass: 'title_toast txt_success',
      messageClass: 'message_toast txt_success',
    });
  }

  showToastError(code: any) {
    let msg = this.convertMsgError(code);
    this.toastService.show(msg, 'Thất bại', {
      toastClass: 'toast_global toast_danger',
      titleClass: 'title_toast txt_danger',
      messageClass: 'message_toast txt_danger',
    });
  }

  showToastWarning(message: any) {
    this.toastService.show(message, 'Cảnh báo', {
      toastClass: 'toast_global toast_warning',
      titleClass: 'title_toast txt_warning',
      messageClass: 'message_toast txt_warning',
    });
  }

  showErrorValidation(error: any) {
    this.parseListError(error);
    this.array_errors.forEach((e: any) => {
      this.toastService.show(e, 'Error notification', {
        toastClass: 'toast_global toast_danger',
        titleClass: 'title_toast txt_light',
        messageClass: 'message_toast txt_light',
      });
    });
  }

  parseListError(error: any) {
    this.array_errors = [];
    for (const [field, err] of Object.entries(error)) {
      let data_err: any = err;
      this.array_errors.push(data_err.toString());
    }
  }

  convertMsgError(code: string) {
    switch (code) {
      case 'WRONG_PASSWORD':
        return 'Sai tài khoản người dùng. Vui lòng thử lại';

      case 'ACCOUNT_NOT_FOUND':
        return 'Tài khoản chưa tồn tại trong hệ thống';

      case 'ACCOUNT_NOT_VERIFY':
        return 'Tài khoản chưa được kích hoạt';

      case 'ACCOUNT_IS_LOCKED':
        return 'Tài khoản đã bị khóa';

      case 'ACCOUNT_NOT_DOCTOR':
        return 'Không phải tài khoản bác sĩ';

      case 'ACCOUNT_NOT_PATIENT':
        return 'Không phải tài khoản bệnh nhân';

      case 'DEVICE_NOT_FOUND':
        return 'Không tìm thấy thiết bị';

      default:
        return 'Vui lòng thử lại sau!';
    }
  }
}
