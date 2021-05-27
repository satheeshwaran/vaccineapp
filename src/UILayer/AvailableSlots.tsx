import {get, times} from 'lodash';
import moment from 'moment';
import React, {Fragment} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SectionGrid} from 'react-native-super-grid';
import {handleBooking} from '../Utils/utils';

const next7Days = times(7, num => {
  return {
    name: moment()
      .add(num + 1, 'd')
      .format('DD/MM'),
  };
});
const AvailableSlots = ({route}) => {
  // console.log(`route.params ${JSON.stringify(route.params)}`);
  const data = get(route.params, 'data.availableSlots', {});
  const alertObject = get(route.params, 'data.alert', {});
  const title = `${get(
    alertObject,
    'vaccine',
    'Any vaccine',
  )} vaccination slots for ${get(alertObject, 'min_age_limit')}+ @ ${get(
    alertObject,
    'displayValue',
  )}`;
  // console.log(`alertObject ${JSON.stringify(alertObject)}`);
  const dates =
    data &&
    data.map(slot => {
      const {name, address, state_name, district_name, sessions} = slot;
      const data = sessions.map(session => {
        const {available_capacity} = session;
        return {name: available_capacity};
      });
      const emptyData = times(next7Days.length - sessions.length, () => {
        return {name: '-'};
      });
      return {
        title: `${name} - ${address} ${district_name} ${state_name}`,
        data: [...data, ...emptyData],
      };
    });

  return (
    <Fragment>
      <Text style={styles.screenHeader}>{title} </Text>
      <SectionGrid
        itemDimension={40}
        // staticDimension={300}
        // fixed
        // spacing={20}
        sections={[
          {
            title: '',
            data: next7Days,
          },
          ...dates,
        ]}
        style={styles.gridView}
        renderItem={({item, section, index}) => {
          if (section.title === '') {
            return (
              <View style={styles.dateContainer}>
                <Text style={styles.dateHeader}>{item.name}</Text>
              </View>
            );
          }
          const availableStyle =
            +item.name > 0 ? styles.availableSlot : styles.unavailableSlot;
          return (
            <TouchableOpacity
              onPress={() => {
                if (+item.name > 0) {
                  handleBooking();
                }
              }}>
              <View style={styles.itemContainer}>
                <Text style={[styles.itemName, availableStyle]}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        renderSectionHeader={({section}) => {
          if (section.title === '') {
            return null;
          }
          return <Text style={styles.sectionHeader}>{section.title}</Text>;
        }}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  gridView: {
    marginTop: 20,
    flex: 1,
  },
  screenHeader: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    margin: 10,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 50,
    flexDirection: 'row',
  },
  dateContainer: {
    height: 40,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: 5,
    flex: 1,
    height: 40,
    alignSelf: 'center',
    textAlignVertical: 'center',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  sectionHeader: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    alignItems: 'center',
    backgroundColor: '#0278d7',
    color: 'white',
    padding: 10,
    fontFamily: 'Helvetica',
  },
  dateHeader: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    backgroundColor: '#0278d7',
    borderRadius: 6,
  },
  availableSlot: {
    backgroundColor: '#2ecc71',
  },
  unavailableSlot: {
    backgroundColor: '#ff0000',
  },
});

export default AvailableSlots;
