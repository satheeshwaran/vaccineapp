import {Card, Left, ListItem, Radio, Right, Segment} from 'native-base';
import {Label} from 'native-base';
import {Input} from 'native-base';
import {
  Button,
  Container,
  Content,
  Icon,
  Item,
  Picker,
  Text,
} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {NativeModules, StyleSheet} from 'react-native';
import {getDistricts, getStates} from '../API/api';
import {addAlerts, validatePINCode} from '../Utils/utils';
import {find, random} from 'lodash';
import {stateList} from '../config/mockdata';
import {primaryColor} from '../config/config';
import {useNavigation} from '@react-navigation/core';

const SelectScreen = () => {
  const [selectedState, setSelectedState] = useState(String);
  const [selectedDistrict, setSelectedDistrict] = useState(String);
  const [states, setStates] = useState<Object[]>();
  const [districts, setDistricts] = useState<Object[]>();
  const [isPinCode, setIsPinCode] = useState(Boolean);
  const [pinCode, setPinCode] = useState(String);
  const [fee, setFee] = useState(Boolean);
  const [ageLimit, setAgeLimit] = useState('18');
  const [vaccineType, setVaccineType] = useState('Any');
  const navigation = useNavigation();

  useEffect(() => {
    getStates()
      .then(response => {
        //console.log(`response ${JSON.stringify(response)}`);
        setStates(response.data.states);
      })
      .catch(ex => setStates(stateList.states));
  }, []);

  const stateSelected = (stateInfo: any) => {
    //console.log(stateInfo);
    setSelectedState(stateInfo);
    getDistricts(stateInfo)
      .then(districtResponse => {
        setDistricts(districtResponse.data.districts);
      })
      .catch(ex => console.log(ex));
  };

  const onPressSchedule = async () => {
    let selectedDistName: any = find(
      districts,
      (d: any) => d.district_id === selectedDistrict,
    );
    let alertObject = {
      type: isPinCode ? 'pincode' : 'district',
      value: isPinCode ? pinCode : selectedDistrict,
      displayValue: isPinCode
        ? pinCode
        : selectedDistName
        ? selectedDistName.district_name
        : 'Your City',
      fee_type: fee === true ? 'Free' : 'Paid',
      min_age_limit: ageLimit,
      alertID: random(1, 10000),
      ...(vaccineType !== 'Any' ? {vaccine: vaccineType} : {}),
    };
    console.log(`alert object ${JSON.stringify(alertObject)}`);
    await addAlerts(alertObject);
    navigation.pop();
  };

  const isValidPIN = isPinCode ? validatePINCode(pinCode) : false;

  return (
    <Container>
      <Content padder>
        <Card>
          <Segment style={styles.segment}>
            <Button
              style={{padding: 22.5}}
              first
              active={!isPinCode}
              onPress={() => setIsPinCode(false)}>
              <Text>State/District</Text>
            </Button>
            <Button
              style={{padding: 22.5}}
              last
              active={isPinCode}
              onPress={() => setIsPinCode(true)}>
              <Text>Pin code</Text>
            </Button>
          </Segment>
          <Label style={styles.sectionTitle}>
            {isPinCode ? 'Enter correct PINCODE' : 'Select State and District'}
          </Label>

          {!isPinCode ? (
            <Fragment>
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{width: undefined}}
                  placeholder="Select your state"
                  placeholderStyle={{color: '#bfc6ea'}}
                  placeholderIconColor="#007aff"
                  selectedValue={selectedState}
                  onValueChange={stateSelected}>
                  {states &&
                    states!.map((state: any) => {
                      const {state_name, state_id} = state;
                      return (
                        <Picker.Item
                          label={state_name}
                          value={state_id}
                          key={state_id}
                        />
                      );
                    })}
                </Picker>
              </Item>

              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{width: undefined}}
                  placeholder="Select your district"
                  placeholderStyle={{color: '#bfc6ea'}}
                  placeholderIconColor="#007aff"
                  selectedValue={selectedDistrict}
                  onValueChange={setSelectedDistrict}>
                  {districts &&
                    districts!.map((district: any) => {
                      const {district_name, district_id} = district;
                      return (
                        <Picker.Item
                          label={district_name}
                          value={district_id}
                          key={district_id}
                        />
                      );
                    })}
                </Picker>
              </Item>
            </Fragment>
          ) : (
            <Fragment>
              <Item floatingLabel success={isValidPIN} error={!isValidPIN}>
                <Label style={styles.pincodeLabel}>Pin code</Label>
                <Input
                  keyboardType="numeric"
                  style={styles.pinCodeField}
                  onChangeText={text => setPinCode(text)}
                  value={pinCode}
                />
                {isValidPIN ? (
                  <Icon name="checkmark-circle" />
                ) : (
                  <Icon name="close-circle" />
                )}
              </Item>
            </Fragment>
          )}
          <Fragment>
            <Label style={styles.sectionTitle}>Vaccine</Label>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{width: undefined}}
                placeholder="Vaccine"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={vaccineType}
                onValueChange={itemValue => setVaccineType(itemValue)}>
                <Picker.Item
                  label="Covishield - Astrazeneca"
                  value="COVISHIELD"
                />
                <Picker.Item label="Covaxin - Bharat BioTech" value="COVAXIN" />
                <Picker.Item label="Any" value="Any" />
              </Picker>
            </Item>
            <Label style={styles.sectionTitle}>Vaccine Fees</Label>
            <ListItem>
              <Left>
                <Text>Free</Text>
              </Left>
              <Right>
                <Radio
                  selected={fee === true}
                  onPress={() => setFee(!fee)}
                  color={'#f0ad4e'}
                  selectedColor={'#5cb85c'}
                />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Paid</Text>
              </Left>
              <Right>
                <Radio
                  selected={fee == false}
                  onPress={() => setFee(!fee)}
                  color={'#f0ad4e'}
                  selectedColor={'#5cb85c'}
                />
              </Right>
            </ListItem>
            <Label style={styles.sectionTitle}>Age limit</Label>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{width: undefined}}
                placeholder="Age Limit"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={ageLimit}
                onValueChange={itemValue => setAgeLimit(itemValue)}>
                <Picker.Item label="18+" value="18" />
                <Picker.Item label="45+ only" value="45" />
              </Picker>
            </Item>
          </Fragment>
        </Card>
        <Button
          full
          onPress={onPressSchedule}
          disabled={
            isPinCode
              ? !isValidPIN
              : stateSelected === undefined && selectedDistrict === undefined
          }
          iconRight
          success
          rounded
          style={styles.sectionContainer}>
          <Icon name="alarm" color="white" />
          <Text> Setup Alert </Text>
        </Button>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  segment: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: primaryColor,
  },
  pincodeLabel: {
    margin: 10,
    fontSize: 20,
    fontWeight: '800',
  },
  pinCodeField: {
    margin: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    margin: 10,
    fontSize: 20,
    fontWeight: '800',
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

export default SelectScreen;
