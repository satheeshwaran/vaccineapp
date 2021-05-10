/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {NotificationBackgroundFetchResult} from 'react-native-notifications';
import App from './App';
import {name as appName} from './app.json';
import {
  processCenterData,
  readAlerts,
  sendNotification,
} from './src/Utils/utils';
import BackgroundFetch from 'react-native-background-fetch';
import {
  fetchDistrictAppointments,
  fetchPINCodeAppointments,
} from './src/Utils/vaccinehelper';

/// Android-only:  BackgroundFetch event-handler when app is terminated.
/// NOTE:  This handler must be placed and registered here in index.js -- DO NOT place this in your App components.
///
const headlessTask = async event => {
  if (event.timeout) {
    console.log('[BackgroundFetch] 💀 HeadlessTask TIMEOUT: ', event.taskId);
    NotificationBackgroundFetchResult.finish(event.taskId);
    return;
  }
  console.log('[BackgroundFetch] 💀 HeadlessTask start: ', event.taskId);
  // Persist the event in AsyncStorage to render in list when app is relaunched.

  readAlerts().then(savedAlerts => {
    // console.log(`saved alerts ${JSON.stringify(savedAlerts)}`);
    if (savedAlerts) {
      savedAlerts.map(async alert => {
        //{"type":"district","value":3,"displayValue":"Nicobar","fee_type":"Paid","min_age_limit":18,"alertID":1602}
        // console.log(`background fetch for alert ${JSON.stringify(alert)}`);
        const {type, value, displayValue} = alert;
        if (type === 'district') {
          let centers = await fetchDistrictAppointments(value);
          //   console.log(`centers ${centers}`);
          if (centers.length > 0) {
            processCenterData(centers, displayValue, alert);
          } else {
            sendNotification(
              'Oops...',
              'We tried but could not find any vaccination centers based on your search criteria. We will keep trying. We are in this together!',
              {},
            );
          }
        } else {
          let centers = await fetchPINCodeAppointments(value);
          processCenterData(centers, displayValue, alert);
        }
      });
    }
  });
  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(event.taskId);
};

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(headlessTask);
AppRegistry.registerComponent(appName, () => App);
