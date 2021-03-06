import {Notifications} from 'react-native-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {get, isEmpty} from 'lodash';
import {Alert, Linking} from 'react-native';
const ALERT_KEY = 'ALERT_KEY_3438684343';
const INTRO_KEY = '35452424';
const COWIN_APP =
  'https://play.google.com/store/apps/details?id=com.cowinapp.app';
const SETU_APP = 'https://www.aarogyasetu.gov.in/app';
const COWIN_SITE = 'https://selfregistration.cowin.gov.in/';
export const validatePINCode = (pincode: string) => {
  return /^[1-9][0-9]{5}$/gm.test(pincode);
};

export const processCenterData = (centers, displayName, queryObject) => {
  const {fee_type, min_age_limit} = queryObject;
  const vaccine = get(queryObject, 'vaccine', '');
  //console.log(`vaccine ${vaccine}`);
  if (centers === undefined) {
    return;
  }
  const availableSlots = centers
    .filter(center => {
      return center.fee_type === fee_type;
    })
    .map(center => {
      const sessions = center.sessions.filter(
        session => {
          if (vaccine !== '' && session.vaccine !== vaccine) {
            return false;
          }
          return (
            session.available_capacity > 0 &&
            session.min_age_limit === +min_age_limit
          );
        },
        //session => session.min_age_limit === 18 && session.available_capacity > 0,
      );
      if (sessions.length === 0) {
        return {};
      }
      const totalSlots = sessions.reduce(
        (acc, session) => acc + session.available_capacity,
        0,
      );
      return {...center, sessions, ...{totalSlots}};
    })
    .filter(slot => !isEmpty(slot));
  // console.log(`available slots ${JSON.stringify(availableSlots)}`);
  if (availableSlots.length > 0) {
    let notificationBody = availableSlots.map(slot => {
      const {name, block_name, district_name, state_name, totalSlots} = slot;
      return `${totalSlots} ${vaccine} 💉 ${
        totalSlots > 1 ? 'Slots' : 'Slot'
      } available at ${name}, ${block_name}, ${district_name}, ${state_name} in the upcoming days.`;
    });

    sendNotification(
      `Vaccination update for ${min_age_limit}+ @ ${displayName}`,
      notificationBody.join('\n'),
      {availableSlots, alert: queryObject},
    );
  } else {
    sendNotification(
      `Vaccination update for ${min_age_limit}+ @ ${displayName}`,
      'Oops no slots available yet, we will try again in sometime. We are in this together!',
      {},
    );
  }
};

export const sendNotification = (
  title: string,
  body: string,
  userInfo: object,
) => {
  Notifications.postLocalNotification({
    body,
    title,
    sound: 'chime.aiff',
    silent: false,
    category: 'Vaccine Alerts',
    userInfo,
  });
};

export const addAlerts = async (alertObject: any) => {
  try {
    const existingAlerts = await AsyncStorage.getItem(ALERT_KEY);
    if (existingAlerts != null) {
      let oldAlerts = JSON.parse(existingAlerts);
      oldAlerts.push(alertObject);
      const jsonValue = JSON.stringify(oldAlerts);
      let response = await AsyncStorage.setItem(ALERT_KEY, jsonValue);
      return response;
    } else {
      const jsonValue = JSON.stringify([alertObject]);
      let response = await AsyncStorage.setItem(ALERT_KEY, jsonValue);
      return response;
    }
  } catch (e) {
    return e;
  }
};

export const readAlerts = async () => {
  try {
    const existingAlerts = await AsyncStorage.getItem(ALERT_KEY);
    //console.log(`existingAlerts ${JSON.stringify(existingAlerts)}`);
    if (existingAlerts != null) {
      let oldAlerts = JSON.parse(existingAlerts);
      return oldAlerts;
    }
  } catch (e) {
    return e;
  }
};

export const removeAlert = async alertID => {
  try {
    const existingAlerts = await AsyncStorage.getItem(ALERT_KEY);
    if (existingAlerts != null) {
      let alerts = JSON.parse(existingAlerts);
      const jsonValue = JSON.stringify(
        alerts.filter(a => a.alertID !== alertID),
      );
      let response = await AsyncStorage.setItem(ALERT_KEY, jsonValue);
      return response;
    } else {
      return 'No Alerts to delete';
    }
  } catch (e) {
    return e;
  }
};

export const getWalkThroughStatus = async () => {
  try {
    const status = await AsyncStorage.getItem(INTRO_KEY);
    return status;
  } catch (e) {
    return e;
  }
};

export const setWalkThroughStatus = async status => {
  try {
    const result = await AsyncStorage.setItem(INTRO_KEY, status);
    return result;
  } catch (e) {
    return e;
  }
};

export const vaccineIcon = (type: string) => {
  switch (type) {
    case 'COVAXIN': {
      return require('../assets/covaxin.jpg');
    }
    case 'COVISHIELD': {
      return require('../assets/covishield.jpg');
    }
    case 'SPUTNIK': {
      return require('../assets/sputnik.jpg');
    }
    default: {
      return require('../assets/2.png');
    }
  }
};

export const handleBooking = () => {
  Alert.alert(
    'Book your slots?',
    'Choose which option you prefer',
    [
      {
        text: 'via COWIN App',
        onPress: () => {
          Linking.openURL(COWIN_APP);
        },
        style: 'cancel',
      },
      {
        text: 'via Arogya Setu',
        onPress: () => {
          Linking.openURL(SETU_APP);
        },
        style: 'cancel',
      },
      {
        text: 'via COWIN Website',
        onPress: () => {
          Linking.openURL(COWIN_SITE);
        },
        style: 'cancel',
      },
    ],
    {cancelable: true},
  );
};
