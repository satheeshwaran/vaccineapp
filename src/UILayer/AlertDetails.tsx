import {useNavigation} from '@react-navigation/core';
import {get} from 'lodash';
import {Button, Container, List, ListItem, Text} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {removeAlert} from '../Utils/utils';

const AlertDetails = ({route}) => {
  console.log(`params ${JSON.stringify(route.params.items)}`);
  const navigation = useNavigation();
  return (
    <Container>
      <List
        dataArray={[route.params.items]}
        renderRow={item => (
          <Fragment>
            <ListItem itemHeader itemDivider>
              <Text>Alert For</Text>
            </ListItem>
            <ListItem>
              <Text>{get(item, 'vaccine', 'vaccine')}</Text>
            </ListItem>
            <ListItem itemHeader itemDivider>
              <Text>{item.type === 'pincode' ? 'Pincode' : 'District'}</Text>
            </ListItem>
            <ListItem>
              <Text>{item.displayValue}</Text>
            </ListItem>
            <ListItem itemHeader itemDivider>
              <Text>Fee Type</Text>
            </ListItem>
            <ListItem>
              <Text>{item.fee_type}</Text>
            </ListItem>
            <ListItem itemHeader itemDivider>
              <Text>Age</Text>
            </ListItem>
            <ListItem>
              <Text>{item.min_age_limit}</Text>
            </ListItem>
          </Fragment>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        full
        danger
        onPress={() =>
          Alert.alert('Delete Alert', 'Are You Sure You Want To Delete?', [
            {
              text: 'Sure',
              onPress: async () => {
                await removeAlert(route.params.items.alertID);
                navigation.navigate('VaccineAlerts');
              },
              style: 'cancel',
            },
          ])
        }>
        <Text>Delete Alert</Text>
      </Button>
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

export default AlertDetails;
