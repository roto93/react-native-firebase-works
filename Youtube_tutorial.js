// Youtube tutorial practice

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator } from '@react-navigation/compat'
import { NavigationContainer } from '@react-navigation/native'
import LoginScreen from './src/Screens/LoginScreen'
import LoadingScreen from './src/Screens/LoadingScreen'
import DashboardScreen from './src/Screens/DashboardScreen'
import firebase from 'firebase'
import { firebaseConfig } from './config'

firebase.initializeApp(firebaseConfig)

export default function App() {
  const SwitchNavigator = createSwitchNavigator({
    LoadingScreen: LoadingScreen,
    LoginScreen: LoginScreen,
    DashboardScreen: DashboardScreen,
  })

  return (
    <NavigationContainer>
      <SwitchNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
