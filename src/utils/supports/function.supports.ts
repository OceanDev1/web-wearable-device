function isEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isNotEmpty(value: any) {
  console.log(`isNotEmpty`, value);

  return value.toString().trim() !== '';
}

function isStrongPassword(password: string) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

function isPhoneNumber(phone: string) {
  const phoneRegex = /^\+?\d{1,4}?[\d\s.-]{3,}$/;
  return phoneRegex.test(phone);
}

function isMinLength(value: string, minLength: number) {
  return value.length >= minLength;
}

let map_heart_rate = [
  {
    value: 0,
    title: 'Bình thường',
    class_txt: 'txt_success',
    risk: [],
    suggestions: [],
  },

  {
    value: 1,
    title: 'Nhịp tim nhanh',
    class_txt: 'txt_danger',
    risk: [
      'Làm tăng áp lực lên tim',
      'Nguy cơ suy tim',
      'Nhồi máu cơ tim',
      'Đột tử do tim ngừng đập',
    ],
    suggestions: [
      'Kiểm tra sức khỏe thường xuyên',
      'Quan tâm chế độ ăn uống',
      'Gặp bắc sĩ ngay khi có thể',
    ],
  },

  {
    value: 2,
    title: 'Nhịp tim chậm',
    class_txt: 'txt_danger',
    risk: ['Gây suy giảm tuần hoàn', 'Nguy cơ ngừng tim', 'Đột quỵ'],
    suggestions: [
      'Kiểm tra sức khỏe thường xuyên',
      'Quan tâm chế độ ăn uống',
      'Gặp bắc sĩ ngay khi có thể',
    ],
  },
];

let map_heart_spo02 = [
  {
    value: 0,
    title: 'Bình thường',
    class_txt: 'txt_success',
    risk: [],
    suggestions: [],
  },

  {
    value: 1,
    title: 'Thiếu Oxy mức độ nhẹ',
    class_txt: 'txt_danger',
    risk: [
      'Khó thở nhẹ',
      'Mệt mỏi, đặc biệt khi gắng sức',
      'Cơ thể không nhận đủ oxy để duy trì hoạt động tối ưu, có thể làm tăng áp lực lên tim',
    ],
    suggestions: [
      'Kiểm tra sức khỏe thường xuyên để theo dõi mức SpO2.',
      'Tập luyện thở sâu và các bài tập hỗ trợ phổi.',
      'Tăng cường môi trường sống thông thoáng, tránh khói thuốc và ô nhiễm không khí.',
    ],
  },

  {
    value: 2,
    title: 'Thiếu Oxy nghiêm trọng',
    class_txt: 'txt_danger',
    risk: [
      'Suy giảm chức năng phổi',
      'Nguy cơ suy tim do thiếu oxy.',
      'Nguy cơ đột quỵ, nhồi máu cơ tim, và tử vong cao',
    ],
    suggestions: ['Cần cấp cứu y tế'],
  },
];

let map_heart_human_temp = [
  {
    value: 0,
    title: 'Hạ thân nhiệt nghiêm trọng',
    class_txt: 'txt_danger',
    risk: ['Suy tim', 'Suy hô hấp', 'Nguy cơ tử vong cao'],
    suggestions: ['Cần cấp cứu', 'Ủ ấm cơ thể'],
  },

  {
    value: 1,
    title: 'Hạ thân nhiệt nhẹ',
    class_txt: 'txt_danger',
    risk: ['Giảm chức năng tuần hoàn', 'Suy yếu hệ miễn dịch'],
    suggestions: ['Giữ ấm cơ thể'],
  },

  {
    value: 2,
    title: 'Bình thường',
    class_txt: 'txt_success',
    risk: [],
    suggestions: ['Duy trì nhiệt độ cơ thể'],
  },

  {
    value: 3,
    title: 'Sốt nhẹ',
    class_txt: 'txt_danger',
    risk: ['Cần theo dõi tình trạng nhiễm trùng hoặc bệnh lý tiềm ẩn'],
    suggestions: ['Uống nước', 'Nghỉ ngơi', 'Theo dõi nhiệt độ'],
  },

  {
    value: 4,
    title: 'Sốt trung bình',
    class_txt: 'txt_danger',
    risk: ['Nguy cơ mất nước', 'Suy yếu hệ miễn dịch'],
    suggestions: [
      'Uống nhiều nước, thuốc hạ sốt',
      'Thăm khám y tế nếu kéo dài',
    ],
  },

  {
    value: 5,
    title: 'Sốt cao',
    class_txt: 'txt_danger',
    risk: ['Đột quỵ', 'Tổn thương các hệ cơ quan'],
    suggestions: ['Cần cấp cứu'],
  },
];

let map_heart_environment_temp = [
  {
    value: 0,
    title: 'Lạnh',
    class_txt: 'txt_danger',
    risk: [
      'Nguy cơ hạ thân nhiệt',
      'Giảm tuần hoàn máu',
      'Suy yếu hệ miễn dịch',
    ],
    suggestions: ['Giữ ấm', 'Mặc nhiều lớp quần áo, tránh gió lạnh'],
  },

  {
    value: 1,
    title: 'Lạnh vừa',
    class_txt: 'txt_danger',
    risk: ['Có thể gây khó chịu nếu tiếp xúc lâu', 'Suy yếu hệ miễn dịch'],
    suggestions: ['Giữ ấm cơ thể'],
  },

  {
    value: 2,
    title: 'Thoải mái',
    class_txt: 'txt_success',
    risk: [],
    suggestions: ['Duy trì nhiệt độ cơ thể'],
  },

  {
    value: 3,
    title: 'Nóng vừa',
    class_txt: 'txt_danger',
    risk: ['Có thể gây mất nước', 'Mệt mỏi nếu hoạt động thể chất'],
    suggestions: ['Uống nước', 'Nghỉ ngơi'],
  },

  {
    value: 4,
    title: 'Nóng',
    class_txt: 'txt_danger',
    risk: ['Nguy cơ kiệt sức vì nóng', 'Mất nước'],
    suggestions: [
      'Uống nhiều nước, ở nơi thoáng mát'
    ],
  },

  {
    value: 5,
    title: 'Nóng nghiêm trọng',
    class_txt: 'txt_danger',
    risk: ['Có thể gây đột quỵ nhiệt', 'Nguy cơ tử vong cao'],
    suggestions: ['Làm mát cơ thể'],
  },
];
export class SupportFunctionServices {
  checkValidationForm(form: any, rules: any) {
    let isValid = true;
    const errors: Record<string, string[]> = {};

    for (const [field, ruleSet] of Object.entries(rules)) {
      const input = form[field];
      const value = input;
      const ruleSets: any = ruleSet;
      for (const [rule, ruleValue] of Object.entries(ruleSets)) {
        switch (rule) {
          case 'required':
            if (ruleValue && !isNotEmpty(value)) {
              isValid = false;
              errors[field] = errors[field] || [];
              errors[field].push(`This field ${field} is required.`);
            }
            break;

          case 'email':
            if (ruleValue && !isEmail(value)) {
              isValid = false;
              errors[field] = errors[field] || [];
              errors[field].push('Invalid email format.');
            }
            break;

          case 'phone':
            if (ruleValue && !isPhoneNumber(value)) {
              isValid = false;
              errors[field] = errors[field] || [];
              errors[field].push('Invalid phone number.');
            }
            break;

          case 'minLength':
            if (!isMinLength(value, ruleValue as number)) {
              isValid = false;
              errors[field] = errors[field] || [];
              errors[field].push(`Minimum length is ${ruleValue} characters.`);
            }
            break;
        }
      }
    }
    return { isValid, errors };
  }

  convertDateToDate(params: any) {
    const date_parse = new Date(params);

    const date = this.insert0IntoText(date_parse.getDate());
    const month = this.insert0IntoText(date_parse.getMonth() + 1);
    const year = date_parse.getFullYear();

    return date + '-' + month + '-' + year;
  }

  formatDateRangeWeek(date: any) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  convertDateToTime(params: any) {
    const date_parse = new Date(params);

    const hour = this.insert0IntoText(date_parse.getHours());
    const minute = this.insert0IntoText(date_parse.getMinutes());

    return hour + ' : ' + minute;
  }

  sortDataHeart(heart: any) {
    if (heart == 'Presence') return 'Khả năng mắc bệnh tim cao';

    return 'Chưa có dấu hiệu bất thường';
  }

  sortDataMotion(motion: any) {
    if (motion == 'fall') return 'Ngã xuống đất';
    if (motion == 'lfall') return 'Ngã về bên trái';
    if (motion == 'rfall') return 'Ngã về bên phải';
    if (motion == 'light') return 'Cử động nhẹ';
    if (motion == 'impact') return 'Ngồi';
    if (motion == 'step') return 'Lên / xuống cầu thang';
    if (motion == 'walk') return 'Đi bộ';

    return 'Chưa có dấu hiệu bất thường';
  }

  sortDataAir(air: any) {
    if (air <= 1) return 'Tốt';
    else if (air > 1 && air <= 3) return 'Trung bình';
    else return 'Không tốt';

    return '';
  }

  sortDataSp02(spo2: any) {
    if (spo2 == 3) return 'Nguy hiểm đến tính mạng';
    if (spo2 == 2) return 'Nồng độ Oxy trong máu báo động';
    if (spo2 == 1) return 'Có nguy cơ bị thiếu Oxy trong máu';
    if (spo2 == 0) return 'Nồng độ Oxy trong máu tốt';

    return '';
  }

  insert0IntoText(params: any) {
    if (params < 10) return '0' + params;
    return params;
  }

  calculateAge(dateOfBirth: any) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  calculateDaysUntil(milliseconds: any) {
    const targetDate = new Date(milliseconds).getTime();

    const today = new Date().getTime();

    const timeDifference = today - targetDate;

    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
  }

  sortDataEvaluationHeart(value: any) {
    let data = map_heart_rate.find((x) => x.value == value);

    return data;
  }

  sortDataEvaluationSpo2(value: any) {
    let data = map_heart_spo02.find((x) => x.value == value);

    return data;
  }

  sortDataEvaluationHumanTemperature(value: any) {
    let data = map_heart_human_temp.find((x) => x.value == value);

    return data;
  }

  sortDataEvaluationEnvironmentTemperature(value: any) {
    let data = map_heart_environment_temp.find((x) => x.value == value);

    return data;
  }
}
