import React, {useEffect, useRef, useState} from 'react';
import {Alert, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SelectScreen from './src/UILayer/SelectScreen';
import BackgroundFetch from 'react-native-background-fetch';
import {
  getWalkThroughStatus,
  processCenterData,
  readAlerts,
  sendNotification,
  setWalkThroughStatus,
} from './src/Utils/utils';
import {
  fetchDistrictAppointments,
  fetchPINCodeAppointments,
} from './src/Utils/vaccinehelper';
import AlertsScreen from './src/UILayer/Alerts';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Image, Text, View} from 'react-native';
import {Button, Icon} from 'native-base';
import RNDisableBatteryOptimizationsAndroid from '@brandonhenao/react-native-disable-battery-optimizations-android';
import TipsScreen from './src/UILayer/Tips';
import {primaryColor, slides} from './src/config/config';
import AlertDetails from './src/UILayer/AlertDetails';
import AppModule from './src/Utils/AppModule';
import {navigationStateChangeHandler} from './src/Utils/Analytics';
import {Notification, Notifications} from 'react-native-notifications';
import {NotificationActionResponse} from 'react-native-notifications/lib/dist/interfaces/NotificationActionResponse';
import {customNavigate, navigationRef} from './src/Utils/RootNavigation';
import AvailableSlots from './src/UILayer/AvailableSlots';
import {notificationUserInfo} from './src/config/mockdata';
const initBackgroundFetch = async () => {
  // BackgroundFetch event handler.
  const onEvent = async taskId => {
    console.log('[BackgroundFetch] task: ', taskId);
    // Do your background work...
    readAlerts()
      .then(savedAlerts => {
        console.log(`saved alerts ${JSON.stringify(savedAlerts)}`);
        if (savedAlerts) {
          savedAlerts.map(async alert => {
            //{"type":"district","value":3,"displayValue":"Nicobar","fee_type":"Paid","min_age_limit":18,"alertID":1602}
            console.log(`background fetch for alert ${JSON.stringify(alert)}`);
            const {type, value, displayValue} = alert;
            if (type === 'district') {
              let centers = await fetchDistrictAppointments(value);
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
        } else {
          BackgroundFetch.finish(taskId);
        }
      })
      .catch(e => {
        console.error(e);
        BackgroundFetch.finish(taskId);
      });
    // IMPORTANT:  You must signal to the OS that your task is complete.
    BackgroundFetch.finish(taskId);
  };

  // Timeout callback is executed when your Task has exceeded its allowed running-time.
  // You must stop what you're doing immediately BackgorundFetch.finish(taskId)
  const onTimeout = async taskId => {
    console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
    BackgroundFetch.finish(taskId);
  };

  // Initialize BackgroundFetch only once when component mounts.
  let status = await BackgroundFetch.configure(
    {minimumFetchInterval: 15},
    onEvent,
    onTimeout,
  );

  console.log('[BackgroundFetch] configure status: ', status);
};

const _renderItem = ({item}) => {
  return (
    <View style={[styles.slide, {backgroundColor: item.backgroundColor}]}>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={item.image} />
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );
};

const _renderNextButton = () => {
  return (
    <View style={styles.buttonCircle}>
      <Icon name="arrow-forward-circle-outline" style={styles.icon} />
    </View>
  );
};
const _renderDoneButton = () => {
  return (
    <View style={styles.buttonCircle}>
      <Icon name="checkmark-done-circle-outline" style={styles.icon} />
    </View>
  );
};

const registerNotificationHandler = () => {
  Notifications.events().registerNotificationOpened(
    (
      notification: Notification,
      completion: () => void,
      action: NotificationActionResponse,
    ) => {
      console.log('Notification opened by device user', notification.payload);
      completion();
      customNavigate('AvailableSlots', {
        data: notification.payload.userInfo,
      });
    },
  );
};
const Stack = createStackNavigator();
const App = () => {
  const routeNameRef = useRef();

  useEffect(() => {
    getWalkThroughStatus().then(status => {
      if (status === 'true') {
        setShowApp(true);
      } else {
        setShowApp(false);
      }
    });
  }, []);
  const [showApp, setShowApp] = useState(true);
  initBackgroundFetch();
  registerNotificationHandler();
  if (!showApp) {
    return (
      <AppIntroSlider
        renderItem={_renderItem}
        data={slides}
        onDone={async () => {
          await setWalkThroughStatus('true');
          RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then(
            isEnabled => {
              AppModule.hasVendorOptimization()
                .then(result => {
                  if (isEnabled) {
                    Alert.alert(
                      'Battery optimzation/Doze mode detected',
                      `To give us unblocked access to sync vaccine appointments and to notify you, we need this to be turned off. \nGo to settings->Choose Not optimized->Scroll to Vaccine app, tap it and choose "Don't optimize". \nPlease note this might be different for OS versions and models. ${
                        result
                          ? '\n \n Also enable auto start in the next step.'
                          : ''
                      }`,
                      [
                        {
                          text: 'Go to settings',
                          onPress: () => {
                            RNDisableBatteryOptimizationsAndroid.openBatteryModal();
                            if (result.status) {
                              AppModule.startBatteryOptimizationScreens();
                            }
                          },
                          style: 'cancel',
                        },
                      ],
                      {
                        cancelable: true,
                        onDismiss: () =>
                          Alert.alert(
                            'Oops',
                            'We though we could help you but you denied access ;-( \n Do you want to try again?',
                            [
                              {
                                text: 'Yes sure!',
                                onPress: () =>
                                  RNDisableBatteryOptimizationsAndroid.openBatteryModal(),
                                style: 'cancel',
                              },
                            ],
                            {
                              cancelable: true,
                            },
                          ),
                      },
                    );
                  }
                })
                .catch(e => console.warn(e));
            },
          );
          setShowApp(true);
        }}
        renderDoneButton={_renderDoneButton}
        renderNextButton={_renderNextButton}
      />
    );
  } else {
    return (
      <NavigationContainer
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
        }
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
          if (previousRouteName !== currentRouteName) {
            await navigationStateChangeHandler(
              routeNameRef.current,
              navigationRef.current.getCurrentRoute().name,
            );
          }
          routeNameRef.current = currentRouteName;
        }}>
        <StatusBar barStyle="light-content" backgroundColor={primaryColor} />
        <Stack.Navigator
          initialRouteName="VaccineAlerts"
          screenOptions={{
            headerStyle: {
              backgroundColor: primaryColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="VaccineAlerts"
            component={AlertsScreen}
            options={({navigation}) => ({
              headerTitle: 'Vaccine Alerts',
              headerRight: () => (
                <Button
                  transparent
                  onPress={
                    () =>
                      // navigation.navigate('Tips')
                      navigation.navigate('Available Slots', {
                        data: notificationUserInfo,
                      }) //TODO; For debugging please remove.
                  }>
                  <Icon name="bulb" color="#ffffff" />
                </Button>
              ),
            })}
          />
          <Stack.Screen name="Select Location" component={SelectScreen} />
          <Stack.Screen name="Tips" component={TipsScreen} />
          <Stack.Screen name="Alert Details" component={AlertDetails} />
          <Stack.Screen name="Available Slots" component={AvailableSlots} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  icon: {fontSize: 40, color: 'white'},
});

export default App;
