import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import firebase from 'firebase'
import Btn from '../../src/components/Btn';
import Modal from 'react-native-modal'
import * as Google from 'expo-google-app-auth';

export default function EmailScreen() {
    const auth = firebase.auth()
    const [logIn, setLogIn] = useState(true);
    const [showReAuthModal, setShowReAuthModal] = useState(false);
    const [confirmPass, setConfirmPass] = useState('');
    // user state listener

    async function signInWithGoogleAsync() {
        try {
            const result = await Google.logInAsync({
                androidClientId: '994735805040-7q2nlrcnma0mssgvs7fimrmdp6dvuaqk.apps.googleusercontent.com', //在這裡貼上你的用戶端編號
                // iosClientId: YOUR_CLIENT_ID_HERE,
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                onSignIn(result)
                return result.accessToken;
            } else { return { cancelled: true } }
        } catch (e) { return { error: true } }
    }
    function onSignIn(googleUser) {
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe();   // 似乎是listener的常用語法，藉由呼叫函式本身，讓後面的程式只運行一次就好
            if (!isUserEqual(googleUser, firebaseUser)) {
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken,
                    googleUser.accessToken
                );

                firebase.auth().signInWithCredential(credential)
                    .catch((error) => { alert('onSignInCredential' + error) });
            } else {
                console.log('User already signed-in Firebase.');
            }
        });
    }
    function isUserEqual(googleUser, firebaseUser) {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.user.id) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }

    const onSignOut = () => {
        auth.signOut()
            .catch(err => alert('onSignOut' + err))
    }


    const onDelete = () => {
        if (!auth.currentUser) return
        auth.currentUser.delete().catch(err => { console.log('onDelete' + err) })
    }


    const checkUser = () => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setLogIn(true)
            } else {
                setLogIn(false)
            }
        })
    }
    useEffect(() => {
        checkUser()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { marginBottom: 8 }]}>Google</Text>
            <Text style={[styles.title, { marginTop: 0 }]}>Auth Test</Text>

            <Btn t={'Google 登入'} f={() => { signInWithGoogleAsync() }} />
            <Btn t={'登出'} f={() => { onSignOut() }} />

            <TouchableOpacity
                style={styles.delete_TO}
                onPress={() => { onDelete() }}
            >
                <Text style={styles.t_delete}>Delete User</Text>
            </TouchableOpacity>
            <Button title={'check'} onPress={() => { console.log(auth.currentUser.email) }} />


            {!auth.currentUser ? null : <Text>log in</Text>}

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
        </View >
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
