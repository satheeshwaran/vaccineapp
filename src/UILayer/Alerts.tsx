import {useNavigation} from '@react-navigation/core';
import {
  Button,
  Container,
  Icon,
  Left,
  List,
  ListItem,
  Text,
  Body,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'; //because of warning => VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.
// import {stateList} from '../config/mockdata';
import {readAlerts, vaccineIcon} from '../Utils/utils';

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState();
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      readAlerts()
        .then(savedAlerts => {
          //console.log(`saved alerts ${JSON.stringify(savedAlerts)}`);
          setAlerts(savedAlerts);
        })
        .catch(e => {
          console.error(e);
          setAlerts(undefined);
        });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  //console.log(alerts);
  return (
    <Container>
      <SafeAreaView>
        <List
          dataArray={alerts}
          renderRow={item => (
            <ListItem
              thumbnail
              onPress={() =>
                navigation.navigate('Alert Details', {items: item})
              }>
              <Left>
                <Image
                  style={styles.tinyLogo}
                  source={vaccineIcon(item.vaccine)}
                />
              </Left>
              <Body>
                <Text>{`${item.vaccine ? item.vaccine : 'Vaccine'} Slots for ${
                  item.min_age_limit
                }+ at ${item.displayValue}`}</Text>
                <Text note numberOfLines={1}>
                  {item.fee_type}
                </Text>
              </Body>
            </ListItem>
          )}
          keyExtractor={(_item, index) => index.toString()}
        />
        <Button
          full
          style={styles.button}
          onPress={() => {
            navigation.navigate('Select Location');
          }}
          iconRight
          success
          rounded>
          <Icon name="alarm" />
          <Text> Setup Alert </Text>
        </Button>
      </SafeAreaView>
      <View style={styles.bottomContainer}>
        <Text
          style={styles.tandc}
          onPress={() => {
            navigation.navigate('Privacy', {tnc: false});
          }}>
          Privacy
        </Text>
        <Text
          style={styles.tandc}
          onPress={() => {
            navigation.navigate('Privacy', {tnc: true});
          }}>
          Terms and conditions
        </Text>
      </View>
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
  tinyLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  button: {
    margin: 20,
  },
  tandc: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: 'blue',
    height: 30,
    fontSize: 13,
    margin: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default AlertsScreen;
