import {times} from 'lodash';
import moment from 'moment';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SectionGrid} from 'react-native-super-grid';
const data = [
  {
    center_id: 185341,
    name: 'SEMMANCHERRY UPHC',
    address: '1ST MAIN ROAD TSUNAMI NAGAR OPP. To Bus Depo Chennai',
    state_name: 'Tamil Nadu',
    district_name: 'Chennai',
    block_name: 'Sholinganallur',
    pincode: 600119,
    lat: 12,
    long: 80,
    from: '09:00:00',
    to: '17:00:00',
    fee_type: 'Free',
    sessions: [
      {
        session_id: 'f4926726-d519-4846-bd7e-349cb3ea9c8f',
        date: '08-05-2021',
        available_capacity: 0,
        min_age_limit: 45,
        vaccine: 'COVISHIELD',
        slots: [
          '09:00AM-11:00AM',
          '11:00AM-01:00PM',
          '01:00PM-03:00PM',
          '03:00PM-05:00PM',
        ],
      },
      {
        session_id: '2b829f29-689e-4f5a-a085-308beeba7c0c',
        date: '09-05-2021',
        available_capacity: 0,
        min_age_limit: 45,
        vaccine: 'COVISHIELD',
        slots: [
          '09:00AM-11:00AM',
          '11:00AM-01:00PM',
          '01:00PM-03:00PM',
          '03:00PM-05:00PM',
        ],
      },
      {
        session_id: 'fc68e329-8607-4c90-b714-1c0ce819e91b',
        date: '10-05-2021',
        available_capacity: 4,
        min_age_limit: 45,
        vaccine: 'COVISHIELD',
        slots: [
          '09:00AM-11:00AM',
          '11:00AM-01:00PM',
          '01:00PM-03:00PM',
          '03:00PM-05:00PM',
        ],
      },
    ],
  },
  {
    center_id: 185332,
    name: 'SHOZHINGANALLUR UPHC',
    address: 'NEDUNCHEZHIYAN STREET AVIN OPPOSITE SHOLINGANALLUR CHENNAI',
    state_name: 'Tamil Nadu',
    district_name: 'Chennai',
    block_name: 'Sholinganallur',
    pincode: 600119,
    lat: 12,
    long: 80,
    from: '09:00:00',
    to: '17:00:00',
    fee_type: 'Free',
    sessions: [
      {
        session_id: 'e3ae199e-fab4-45d9-b26d-3c0f280bd841',
        date: '08-05-2021',
        available_capacity: 0,
        min_age_limit: 45,
        vaccine: 'COVISHIELD',
        slots: [
          '09:00AM-11:00AM',
          '11:00AM-01:00PM',
          '01:00PM-03:00PM',
          '03:00PM-05:00PM',
        ],
      },
      {
        session_id: '9ef07edc-7512-4ae0-8723-26a073f11598',
        date: '09-05-2021',
        available_capacity: 0,
        min_age_limit: 45,
        vaccine: 'COVISHIELD',
        slots: [
          '09:00AM-11:00AM',
          '11:00AM-01:00PM',
          '01:00PM-03:00PM',
          '03:00PM-05:00PM',
        ],
      },
    ],
  },
  {
    center_id: 611121,
    name: 'NEELANKARAI UPHC',
    address:
      'NO 2 5 DR.KALAINGAR KARUNANIDHI SALAI KABALEESWAR NAGAR NEELANGARAI CHENNAI',
    state_name: 'Tamil Nadu',
    district_name: 'Chennai',
    block_name: 'Sholinganallur',
    pincode: 600119,
    lat: 12,
    long: 80,
    from: '09:00:00',
    to: '17:00:00',
    fee_type: 'Free',
    sessions: [
      {
        session_id: 'f2231f72-a565-4ddb-999c-5326c04e081d',
        date: '08-05-2021',
        available_capacity: 0,
        min_age_limit: 45,
        vaccine: 'COVISHIELD',
        slots: [
          '09:00AM-11:00AM',
          '11:00AM-01:00PM',
          '01:00PM-03:00PM',
          '03:00PM-05:00PM',
        ],
      },
      {
        session_id: '0672496c-f36a-415b-9967-218a0afb339d',
        date: '10-05-2021',
        available_capacity: 1,
        min_age_limit: 45,
        vaccine: 'COVISHIELD',
        slots: [
          '09:00AM-11:00AM',
          '11:00AM-01:00PM',
          '01:00PM-03:00PM',
          '03:00PM-05:00PM',
        ],
      },
    ],
  },
];

const next7Days = times(7, num => {
  return {
    name: moment()
      .add(num + 1, 'd')
      .format('DD-MM'),
  };
});
console.log(`next7days ${next7Days}`);
const AvailableSlots = () => {
  const [items, setItems] = React.useState([
    {name: 'TURQUOISE', code: '#1abc9c'},
    {name: 'EMERALD', code: '#2ecc71'},
    {name: 'PETER RIVER', code: '#3498db'},
    {name: 'AMETHYST', code: '#9b59b6'},
    {name: 'WET ASPHALT', code: '#34495e'},
    {name: 'GREEN SEA', code: '#16a085'},
    {name: 'NEPHRITIS', code: '#27ae60'},
    {name: 'BELIZE HOLE', code: '#2980b9'},
    {name: 'WISTERIA', code: '#8e44ad'},
    {name: 'MIDNIGHT BLUE', code: '#2c3e50'},
    {name: 'SUN FLOWER', code: '#f1c40f'},
    {name: 'CARROT', code: '#e67e22'},
    {name: 'ALIZARIN', code: '#e74c3c'},
    {name: 'CLOUDS', code: '#ecf0f1'},
    {name: 'CONCRETE', code: '#95a5a6'},
    {name: 'ORANGE', code: '#f39c12'},
    {name: 'PUMPKIN', code: '#d35400'},
    {name: 'POMEGRANATE', code: '#c0392b'},
    {name: 'SILVER', code: '#bdc3c7'},
    {name: 'ASBESTOS', code: '#7f8c8d'},
  ]);

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
        {
          title: 'Title2',
          data: items.slice(6, 12),
        },
        {
          title: 'Title3',
          data: items.slice(12, 20),
        },
      ]}
      style={styles.gridView}
      renderItem={({item, section, index}) => {
        if (section.title === '') {
          console.log(item.name);
          return (
            <View style={styles.dateContainer}>
              <Text style={styles.dateHeader}>{item.name}</Text>
            </View>
          );
        }
        return (
          <View style={[styles.itemContainer, {backgroundColor: item.code}]}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCode}>{item.code}</Text>
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
    height: 150,
  },
  dateContainer: {
    height: 30,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
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
});

export default AvailableSlots;
