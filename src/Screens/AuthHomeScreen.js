import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Btn from '../components/Btn';


export default function AuthHomeScreen(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Auth Home</Text>
            <Btn t='Email' f={() => { props.navigation.navigate('Email') }} />
            <Btn t='Anonymous' f={() => { props.navigation.navigate('Anonymous') }} />
            <Btn t='Google' f={() => { props.navigation.navigate('Google') }} />
            <Btn t='Facebook' f={() => { props.navigation.navigate('Facebook') }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        marginVertical: 20,
    }
})
