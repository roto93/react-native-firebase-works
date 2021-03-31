import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import firebase from 'firebase'
import Btn from '../../src/components/Btn';
import Modal from 'react-native-modal'

export default function EmailScreen() {
    const auth = firebase.auth()
    const [showReAuthModal, setShowReAuthModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [username, setUsername] = useState('');

    const onAnonymouslyLogIn = () => {
        auth.signInAnonymously().then((result) => alert('You\'ve logged in.')).catch(err => alert(err))
    }
    const onSignOut = () => {
        if (!auth.currentUser) { return }
        if (auth.currentUser.isAnonymous) { auth.currentUser.delete().then((res) => { console.log('delete') }).catch((err) => { alert('onSignOut' + err) }) }
        else auth.signOut().catch((err) => { alert(err) })
    }
    const onDelete = () => {
        if (auth.currentUser)   // 如果未登入 auth.currentUser 會是 null，則 null.delete() 會報錯
            auth.currentUser.delete()
                .then((result) => { alert('User has been deleted!') })
                .catch(err => { setShowReAuthModal(true), console.log('onDelete' + err) })
    }
    const onReAuth = () => {
        const credential = firebase.auth.EmailAuthProvider.credential(
            auth.currentUser.email,
            confirmPass
        );
        auth.currentUser.reauthenticateWithCredential(credential).catch(err => alert(err))
    }
    const onLink = () => {
        const credential = firebase.auth.EmailAuthProvider.credential(email, pass)
        auth.currentUser.linkWithCredential(credential)
            .then((res) => { alert('User has been linked') })
            .catch((err) => { alert('onLink' + err) })
    }


    // user state listener
    const checkUser = () => {
        const logInSetup = (user) => {
            setUsername(user.email)
        }
        const logOutSetup = () => {
            setUsername('')
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
            <Btn t={'匿名登入'} f={() => { onAnonymouslyLogIn() }} />
            <Btn t={'登出'} f={() => { onSignOut() }} />
            {!auth.currentUser ? null : auth.currentUser.isAnonymous ? <Text>You are logged in anonymously</Text> : <Text>Hi  {auth.currentUser.email}</Text>}
            <TouchableOpacity
                style={styles.delete_TO}
                onPress={() => { onDelete() }}
            >
                <Text style={styles.t_delete}>Delete User</Text>
            </TouchableOpacity>
            <Btn
                t={'切換成 email 登入'}
                style={{ marginTop: 30 }}
                f={() => { setShowLinkModal(true) }}
            />
            <Modal
                isVisible={showLinkModal}
                onBackButtonPress={() => { setShowLinkModal(false) }}
                onBackdropPress={() => { setShowLinkModal(false) }}
                useNativeDriver={true}
            >
                <View style={styles.modal_container}>
                    <TextInput
                        style={styles.tInput}
                        placeholder={'email'}
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
                    <Btn t={'Link'} f={() => { onLink() }} />
                </View>
            </Modal>

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
