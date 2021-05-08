import {useNavigation} from '@react-navigation/native';
import {Container} from 'native-base';
import React, {useState} from 'react';
import {
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import WebView from 'react-native-webview';
const rootURL = 'https://whoismyleader-a20ac.web.app/privacypolicycowin.html';

const TermsAndConditions = () => {
  const [accepted, setAcceptd] = useState(false);
  const navigation = useNavigation();

  return (
    <Container style={styles.container}>
      <WebView source={{uri: rootURL}} startInLoadingState />
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Text style={styles.buttonLabel}>Accept</Text>
      </TouchableOpacity>
    </Container>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    alignSelf: 'center',
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcL: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    height: height * 0.7,
  },

  button: {
    backgroundColor: '#136AC7',
    borderRadius: 5,
    padding: 10,
  },

  buttonDisabled: {
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10,
  },

  buttonLabel: {
    fontSize: 14,
    color: '#FFF',
    alignSelf: 'center',
  },
});

export default TermsAndConditions;
