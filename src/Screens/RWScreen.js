import React, { useState, useEffect } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import firebase from 'firebase'
import Btn from '../components/Btn'

// Read and Write Screen
const RWScreen = (props) => {
    const auth = firebase.auth()
    const user = auth.currentUser
    // 登入/未登入的頁面最好分開寫，不然都寫在同個頁面的話，每個環節還要額外判斷有沒有登入真的很煩
    if (!user) {
        return (
            <View style={styles.container}>
                <Text>You have to sign in first.</Text>
                <Button title={'sign in'} onPress={() => { props.navigation.navigate('Auth') }} />
            </View>
        )
    }
    const db = firebase.database()
    const [content, setContent] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userContent, setUserContent] = useState('');
    const userRef = db.ref(`/users/${user.uid}`)
    const checkData = () => { userRef.on('value', snap => { console.log(snap) }) }
    const onWrite = () => {
        db.ref('/users/' + user.uid).set(
            {
                uid: user.uid,
                user_email: user.email ? user.email : 'none',
                content: content,
                timeStamp: Date.now()
            }
        )
    }
    useEffect(() => {
        // 從 database 讀取資料，需要把 on() 寫在 useEffect 裡
        userRef.on('value', snap => {
            setUserEmail(JSON.stringify(snap.child('user_email').val()))
            setUserContent(JSON.stringify(snap.child('content').val()))
        })
    }, [])

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.tInput}
                placeholder={'type something'}
                value={content}
                onChangeText={(text) => { setContent(text) }}
            />
            <Btn t={'write'} f={() => { onWrite() }} />


            <Text>Hi  {!user ? null : user.displayName ? user.displayName : user.email}</Text>
            <Text>Your e-mail: {userEmail}</Text>
            <Text>Your content: {userContent}</Text>

            <Button title={'check data'} onPress={() => { checkData() }} />
        </View>
    )
}

export default RWScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 20,
    },
    tInput: {
        borderBottomWidth: 1,
        width: 250,
        height: 60,
        fontSize: 20,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 10,
    }
})
