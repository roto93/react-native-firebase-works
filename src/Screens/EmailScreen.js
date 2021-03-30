import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import firebase from 'firebase'
import Btn from '../../src/components/Btn';
import Modal from 'react-native-modal'

export default function EmailScreen() {
    const auth = firebase.auth()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showReAuthModal, setShowReAuthModal] = useState(false);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [username, setUsername] = useState('');

    const onLogIn = () => {
        auth.signInWithEmailAndPassword(email, pass).then((result) => alert('You\'ve logged in.')).catch(err => alert(err))
    }
    const onSignIn = () => {
        // TODO: Check real email
        auth.createUserWithEmailAndPassword(email, pass).catch(err => alert(err))
    }
    const onSignOut = () => {
        auth.signOut()
    }
    const onDelete = () => {
        if (auth.currentUser)   // 如果未登入 auth.currentUser 會是 null，則 null.delete() 會報錯
            auth.currentUser.delete()
                .then((result) => { setIsLoggedIn(false), alert('User has been deleted!') })
                .catch(err => { setShowReAuthModal(true), console.log(err) })
    }
    const onReAuth = () => {
        const credential = firebase.auth.EmailAuthProvider.credential(
            auth.currentUser.email,
            confirmPass
        );
        auth.currentUser.reauthenticateWithCredential(credential).catch(err => alert(err))
    }



    // user state listener
    const checkUser = () => {
        const logInSetup = (user) => {
            setUsername(user.email)
            setIsLoggedIn(true)
        }
        const logOutSetup = () => {
            setUsername('')
            setIsLoggedIn(false)
        }
        auth.onAuthStateChanged(user => {
            if (user) {
                logInSetup(user)
            } else {
                logOutSetup()
            }
        })
    }
    useEffect(() => {
        checkUser()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Auth Test</Text>
            <TextInput
                style={styles.tInput}
                placeholder={'e-mail'}
                value={email}
                onChangeText={(text) => { setEmail(text) }}
            />
            <TextInput
                style={styles.tInput}
                placeholder={'password'}
                secureTextEntry={true}
                value={pass}
                onChangeText={(text) => { setPass(text) }}
            />
            <Btn t={'log in'} f={() => { onLogIn() }} />
            <Btn t={'Sign in'} f={() => { onSignIn() }} />
            <Btn t={'Sign out'} f={() => { onSignOut() }} />
            {isLoggedIn ? <Text>Hi  {username}</Text> : null}
            <TouchableOpacity
                style={styles.delete_TO}
                onPress={() => { onDelete() }}
            >
                <Text style={styles.t_delete}>Delete User</Text>
            </TouchableOpacity>
            <Modal
                isVisible={showReAuthModal}
                onBackButtonPress={() => { setShowReAuthModal(false) }}
                onBackdropPress={() => { setShowReAuthModal(false) }}
                useNativeDriver={true}
            >
                <View style={styles.modal_container}>
                    <TextInput
                        style={styles.tInput}
                        placeholder={'password'}
                        secureTextEntry={true}
                        value={confirmPass}
                        onChangeText={(text) => { setConfirmPass(text) }}
                    />
                    <Btn t={'confirm'} f={() => { onReAuth(), onDelete() }} />
                </View>
            </Modal>
        </View>
    );
}

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
