import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native'
import firebase from 'firebase'

function DashboardScreen(props) {
    return (
        <View style={styles.container}>
            <Text>Log in</Text>
            <Button title={'sign out'} onPress={() => { firebase.auth().signOut() }} />
        </View>
    );
}

export default DashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})