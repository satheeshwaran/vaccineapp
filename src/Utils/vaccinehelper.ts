import {
  fetchAppointmentsByDistrict,
  fetchAppointmentsByPINCode,
} from '../API/api';

export const fetchPINCodeAppointments = (pinCode: string) => {
  return new Promise((resolve, reject) => {
    fetchAppointmentsByPINCode(pinCode)
      .then(resp => {
        //console.log(resp);
        const {centers} = resp.data;
        resolve(centers);
      })
      .catch(ex => reject(ex));
  });
};

export const fetchDistrictAppointments = (district: string) => {
  return new Promise((resolve, reject) => {
    fetchAppointmentsByDistrict(district)
      .then(resp => {
        //console.log(resp);
        const {centers} = resp.data;
        resolve(centers);
      })
      .catch(ex => reject(ex));
  });
};
