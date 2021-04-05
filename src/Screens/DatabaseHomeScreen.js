import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Btn from '../components/Btn';


export default function DatabaseHomeScreen(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Database Home</Text>
            <Btn t={'Read and Write'} f={() => { props.navigation.navigate('RW') }} />
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
