// const SERVER_MAIN = 'http://localhost:9991/api/';
const SERVER_MAIN = 'http://118.69.168.44:9991/api/';
// const SERVER_MAIN = 'http://localhost:9991/api/';

const VERSION = 'v1/';

const ACCOUNT = 'account/';
const PATIENT = 'patients/';
const DEVICE = 'devices/';
const APPOINTMENT = 'appointment/';
const READING = 'readings/';

export const ApiConfigs = {
  AUTHENTICATION: {
    GET_BY_TOKEN: SERVER_MAIN + VERSION + ACCOUNT + 'by-token',
    LOGIN: SERVER_MAIN + VERSION + PATIENT + 'login-dt',
    GET_DATA_DASHBOARD:
      SERVER_MAIN + VERSION + ACCOUNT + 'get-dashboard?timestamp=',
  },

  APPOINTMENT: {
    GET_BY_DOCTOR_AND_RANGE_WEEK:
      SERVER_MAIN + VERSION + APPOINTMENT + 'get-by-doctor-and-range-week',

    UPDATE_STATUS: SERVER_MAIN + VERSION + APPOINTMENT + 'update-status',
  },

  PATIENT: {
    CREATE: SERVER_MAIN + VERSION + PATIENT,
    DETAIL: SERVER_MAIN + VERSION + PATIENT + 'detail-patient?accountId=',
    UPDATE_DATA_HEALTH: SERVER_MAIN + VERSION + PATIENT + 'update-data-health',
    GET_ALL_MANAGEMENT: SERVER_MAIN + VERSION + PATIENT + 'get-all-patients',
    GET_HISTORY_ALARM:
      SERVER_MAIN + VERSION + PATIENT + 'get-history-alarms?accountId=',
  },

  DEVICE: {
    SETTING_ACCOUNT_ALARM:
      SERVER_MAIN + VERSION + DEVICE + 'setting-account-alarm',
    REMOVE_ACCOUNT_ALARM:
      SERVER_MAIN + VERSION + DEVICE + 'remove-account-alarm',
    SET_FOR_ACCOUNT: SERVER_MAIN + VERSION + DEVICE + 'set-account',
    REMOVE_IN_ACCOUNT: SERVER_MAIN + VERSION + DEVICE + 'remove-in-account',
    GET_MANAGEMENT: SERVER_MAIN + VERSION + DEVICE + 'get-all',
    FULL_DETAIL: SERVER_MAIN + VERSION + DEVICE + 'full-detail?deviceId=',
    RESTART: SERVER_MAIN + VERSION + DEVICE + 'restart-device?mac=',
    GET_DATA_ALARM: SERVER_MAIN + VERSION + DEVICE + 'get-data-alarm?alarmId=',
  },

  READING: {
    GET_FIRST: SERVER_MAIN + VERSION + READING + 'get-first?deviceId=',
  },
};
