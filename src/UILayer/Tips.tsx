import {useNavigation} from '@react-navigation/core';
import {
  Button,
  Card,
  Container,
  Content,
  Header,
  Icon,
  Item,
  Left,
  List,
  ListItem,
  Right,
  Text,
  Body,
  H1,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'; //because of warning => VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.
import {readAlerts} from '../Utils/utils';
import {getManufacturer} from 'react-native-device-info';
import {WebView} from 'react-native-webview';

const rootURL = 'https://dontkillmyapp.com/';
const TipsScreen = () => {
  const [url, setURL] = useState();
  useEffect(() => {
    const man = getManufacturer().then(man =>
      setURL(`${rootURL}${man.toLocaleLowerCase()}`),
    );
  }, []);
  console.log(url);
  return (
    <Container>
      <H1 style={{margin: 20}}>
        Follow the tips mentioned below to enhance the reliability of
        vaccination slot alerts
      </H1>
      <WebView source={{uri: url}} startInLoadingState/>
    </Container>
  );
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
});

export default TipsScreen;
