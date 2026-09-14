function isEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isNotEmpty(value: any) {
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

export const IFunctionErrorCheck = {
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
              errors[field].push(`Trường ${field} không được trống.`);
            }
            break;

          case 'email':
            if (ruleValue && !isEmail(value)) {
              isValid = false;
              errors[field] = errors[field] || [];
              errors[field].push('Địa chỉ email không đúng.');
            }
            break;

          case 'phone':
            if (ruleValue && !isPhoneNumber(value)) {
              isValid = false;
              errors[field] = errors[field] || [];
              errors[field].push('Số điện thoại không đúng.');
            }
            break;

          case 'minLength':
            if (!isMinLength(value, ruleValue as number)) {
              isValid = false;
              errors[field] = errors[field] || [];
              errors[field].push(`Có tối thiểu ${ruleValue} ký tự.`);
            }
            break;
        }
      }
    }
    return { isValid, errors };
  },
};
