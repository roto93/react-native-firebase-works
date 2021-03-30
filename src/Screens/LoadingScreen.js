import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import firebase from 'firebase'

function LoadingScreen(props) {

    const checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged((user) => {   //如果用戶有登入，會回傳用戶名稱
            if (user) { props.navigation.navigate('DashboardScreen') }  // 如果有回傳用戶名稱，就導航到Dashboard
            else { props.navigation.navigate('LoginScreen') } // 沒有的話就導航到LoginScreen
        })
    }

    useEffect(() => {
        checkIfLoggedIn()
    }, [])

    return (
        <View style={styles.container}>
            <ActivityIndicator size={100} color='gray' />
        </View>
    );
}

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})