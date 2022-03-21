/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {HomeScreen} from './pages/HomeScreen'
import {MedicalCertificateResultsScreen} from './pages/MedicalCertificateResultsScreen'

import ScanbotSDK from 'react-native-scanbot-sdk';

const Stack = createStackNavigator();

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.initScanbotSdk();
  }

  async initScanbotSdk() {
    const options = {
      licenseKey: '',
      loggingEnabled: true, // Consider switching logging OFF in production builds for security and performance reasons!
    };
    try {
      const result = await ScanbotSDK.initializeSDK(options);
      console.log(result);
    } catch (e) {
      console.error('Error initializing Scanbot SDK:', e.message);
    }
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={HomeScreen.PAGE_NAME}>
          <Stack.Screen name={HomeScreen.PAGE_NAME} component={HomeScreen} />
          <Stack.Screen
            name={MedicalCertificateResultsScreen.PAGE_NAME}
            component={MedicalCertificateResultsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
