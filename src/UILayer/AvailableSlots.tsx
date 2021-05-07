import {times} from 'lodash';
import moment from 'moment';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SectionGrid} from 'react-native-super-grid';

const next7Days = times(7, num => {
  return {
    name: moment()
      .add(num + 1, 'd')
      .format('DD-MM'),
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
          <View style={[styles.itemContainer, {backgroundColor: item.code}]}>
            <Text style={[styles.itemName, availableStyle]}>{item.name}</Text>
          </View>
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
    marginTop: 20,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 50,
  },
  dateContainer: {
    height: 30,
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
    backgroundColor: '#636e72',
    color: 'white',
    padding: 10,
  },
  dateHeader: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    backgroundColor: '#636e72',
    borderRadius: 2,
  },
  availableSlot: {
    backgroundColor: '#2ecc71',
  },
  unavailableSlot: {
    backgroundColor: '#ff0000',
  },
});

export default AvailableSlots;
