import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import firebase from 'firebase'
import { firebaseConfig } from './config'
import { NavigationContainer, } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import EmailScreen from './src/Screens/EmailScreen';
import HomeScreen from './src/Screens/HomeScreen';
import AnonymousScreen from './src/Screens/AnonymousScreen'

if (firebase.apps.length == 0) { firebase.initializeApp(firebaseConfig) }  // 檢查現在有沒有其他在firebase初始化的app，不可以同時有兩個初始化

function App(props) {

    const Stack = createStackNavigator()
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={'Home'} component={HomeScreen} />
                <Stack.Screen name={'Email'} component={EmailScreen} />
                <Stack.Screen name={'Anonymous'} component={AnonymousScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        marginTop: 80,
        marginBottom: 20,
    },
    tInput: {
        borderWidth: 1,
        width: 250,
        height: 50,
        paddingHorizontal: 8,
        marginBottom: 20,
        fontSize: 20,
    },
    delete_TO: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: 'tomato',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 40,
        right: 30,
    },
    t_delete: {
        fontSize: 16,
        textAlign: 'center',
    },
    modal_container: {
        width: '90%',
        height: 500,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 40,
    }
})