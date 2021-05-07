import axios from 'axios';
import moment from 'moment';

const ROOT_URL = 'https://cdn-api.co-vin.in/api/v2/';
const headersObject = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
  },
};

export const getStates = () => {
  return axios.get(`${ROOT_URL}admin/location/states`, headersObject);
};

export const getDistricts = (stateID: string) => {
  return axios.get(
    `${ROOT_URL}admin/location/districts/${stateID}`,
    headersObject,
  );
};

export const fetchAppointmentsByDistrict = (districtID: string) => {
  const selectedDate = moment().add(1, 'd').format('DD-MM-YYYY');
  const url = `${ROOT_URL}appointment/sessions/public/calendarByDistrict?district_id=${districtID}&date=${selectedDate}`;
  console.log(`url ${url}`);
  return axios.get(url, headersObject);
};

export const fetchAppointmentsByPINCode = (pincode: string) => {
  const selectedDate = moment().add(1, 'd').format('DD-MM-YYYY');
  const url = `${ROOT_URL}appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${selectedDate}`;
  console.log(`url ${url}`);
  return axios.get(url, headersObject);
};
