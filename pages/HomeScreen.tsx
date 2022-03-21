
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

import {MedicalCertificateResultsScreen} from './MedicalCertificateResultsScreen'

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import ScanbotSDK from 'react-native-scanbot-sdk';
import { MedicalCertificateScannerResult } from 'react-native-scanbot-sdk/src/result';
import { MedicalCertificateScannerConfiguration } from 'react-native-scanbot-sdk/src/configuration';

const Section = ({children, title}): any => {
    return (
      <View style={styles.sectionContainer}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: Colors.black,
            },
          ]}>
          {title}
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: Colors.dark,
            },
          ]}>
          {children}
        </Text>
      </View>
    );
  };

export class HomeScreen extends React.Component {
    
    public static readonly PAGE_NAME = "Home Screen";

    async startMedicalCertificateScanner() {
        let config: MedicalCertificateScannerConfiguration = {
          topBarBackgroundColor: '#c8193c',
          footerTitle: 'Scan your Medical Certificate',
          footerSubtitle: 'ScanbotSDK Demo',
          // aspectRatios: [
          //   MedicalCertificateStandardSize.A5_PORTRAIT,
          //   MedicalCertificateStandardSize.A6_LANDSCAPE,
          // ],
        };
        const result: MedicalCertificateScannerResult =
          await ScanbotSDK.UI.startMedicalCertificateScanner(config);
    
        if (result.status !== 'OK') {
          return;
        }
        console.log(JSON.stringify(result, undefined, 4));
        MedicalCertificateResultsScreen.result = result.data;
        // @ts-ignore
        this.props.navigation.push(MedicalCertificateResultsScreen.PAGE_NAME);
    }

    render() {
        return (
            <SafeAreaView>
              <StatusBar barStyle="light-content"/>
              <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View>
                  <Section title="Medical Certificate Scanner Demo">
                    Press on the button below to try out the <Text style={styles.highlight}>Medical Certificate Scanner </Text> 
                      Ready-To-Use UI feature!
                  </Section>
                  <View style={styles.button}>
                    <Button title="Launch Medical Certificate Scanner" onPress={this.startMedicalCertificateScanner.bind(this)}/>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
        );
    }
}

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
    button: {
      padding: 24,
    }
  });