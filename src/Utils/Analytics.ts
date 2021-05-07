import analytics from '@react-native-firebase/analytics';
export const navigationStateChangeHandler = async (
  previousRouteName,
  currentRouteName,
) => {
  await analytics().logScreenView({
    screen_name: currentRouteName,
    screen_class: currentRouteName,
  });
};
