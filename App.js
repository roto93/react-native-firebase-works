import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, LogBox } from 'react-native';
import firebase from 'firebase'
import { firebaseConfig } from './config'
import { NavigationContainer, } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import EmailScreen from './src/Screens/EmailScreen';
import AuthHomeScreen from './src/Screens/AuthHomeScreen';
import DatabaseHomeScreen from './src/Screens/DatabaseHomeScreen'
import AnonymousScreen from './src/Screens/AnonymousScreen'
import GoogleScreen from './src/Screens/GoogleScreen'
import FacebookScreen from './src/Screens/FacebookScreen'
import RWScreen from './src/Screens/RWScreen'
import MDicons from 'react-native-vector-icons/MaterialIcons'
import MCicons from 'react-native-vector-icons/MaterialCommunityIcons'

if (firebase.apps.length == 0) { firebase.initializeApp(firebaseConfig) }  // 檢查現在有沒有其他在firebase初始化的app，不可以同時有兩個初始化

function App(props) {
    const Tab = createBottomTabNavigator()
    const Stack = createStackNavigator()
    LogBox.ignoreLogs(['Setting a timer'])
    const AuthHome = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name={'Auth'} component={AuthHomeScreen} />
                <Stack.Screen name={'Email'} component={EmailScreen} />
                <Stack.Screen name={'Anonymous'} component={AnonymousScreen} />
                <Stack.Screen name={'Google'} component={GoogleScreen} />
                <Stack.Screen name={'Facebook'} component={FacebookScreen} />
            </Stack.Navigator>
        )
    }

    const DatabaseHome = () => {
        return (
            <Stack.Navigator
                initialRouteName='Database'
            >
                <Stack.Screen name={'Database'} component={DatabaseHomeScreen} />
                <Stack.Screen name={'RW'} component={RWScreen} />
            </Stack.Navigator>
        )
    }

    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name={'Auth'} component={AuthHome}
                    options={{ tabBarIcon: ({ color }) => { return <MDicons name={'login'} size={32} color={color} /> } }}
                />
                <Tab.Screen
                    name={'Database'} component={DatabaseHome}
                    options={{
                        tabBarIcon: ({ color }) => { return <MCicons name={'database'} size={32} color={color} /> },
                        unmountOnBlur: true
                    }}
                />
            </Tab.Navigator>
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