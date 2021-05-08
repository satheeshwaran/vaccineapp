import {noop, times} from 'lodash';
import moment from 'moment';
import React from 'react';
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
  console.log(`route.params ${JSON.stringify(route.params)}`);
  const {data} = route.params;
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
              <Text style={[styles.itemName, availableStyle]}>{item.name}</Text>
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
  );
};

const styles = StyleSheet.create({
  gridView: {
    paddingTop: 20,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 50,
  },
  dateContainer: {
    height: 40,
    paddingTop:5,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: 5,
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
    fontFamily:'Helvetica'
  },
  dateHeader: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    backgroundColor: '#0278d7',
    borderRadius: 6
  },
  availableSlot: {
    backgroundColor: '#2ecc71',
  },
  unavailableSlot: {
    backgroundColor: '#ff0000',
  },
});

export default AvailableSlots;
