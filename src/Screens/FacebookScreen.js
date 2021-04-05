import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Image, Alert } from 'react-native';
import firebase from 'firebase'
import Btn from '../../src/components/Btn';
import Modal from 'react-native-modal'
import * as Facebook from 'expo-facebook';

export default function FacebookScreen() {
    const auth = firebase.auth()
    const user = auth.currentUser
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [showReAuthModal, setShowReAuthModal] = useState(false);
    const [confirmPass, setConfirmPass] = useState('');
    const [token, setToken] = useState('');
    // user state listener

    async function onLogIn() {
        if (user) { if (user.isAnonymous) await user.delete().then(res => console.log('delete anonymous')) }
        try {
            await Facebook.initializeAsync({
                appId: '918640535633283',
            });

            //{type,token,expirationDate,permissions,declinedPermissions,}
            const result = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
            });
            if (result.type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${result.token}`);
                console.log((await response.json()).name)
                setToken(result.token)
                checkLoginState(result)
            } else {
                console.log('type = cancel')
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    }

    function checkLoginState(response) {
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe();
            if (!isUserEqual(response, firebaseUser)) {
                var credential = firebase.auth.FacebookAuthProvider.credential(
                    response.token);
                firebase.auth().signInWithCredential(credential)
                    .then((res) => { console.log('Logged in!') })
                    .catch((error) => {
                        console.log(error.code)
                        if (error.code == 'auth/account-exists-with-different-credential') {
                            auth.fetchSignInMethodsForEmail(error.email)
                                .then((res) => { alert(`You should log in with ${res} method`) })
                                .catch((err) => { console.log('error= ' + err) })
                        }
                    });
            } else {
                console.log('User is already signed-in Firebase with the correct user.')
            }
        });

    }

    function isUserEqual(facebookAuthResponse, firebaseUser) {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === facebookAuthResponse.userID) {
                    // We don't need to re-auth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }

    const onSignOut = async () => {

        auth.signOut()
            .then((res) => { setToken('') })
            .catch(err => alert('onSignOut' + err))
    }


    const onDelete = () => {
        if (!auth.currentUser) return
        auth.currentUser.delete().catch(err => { console.log('onDelete' + err) })
    }


    const checkUser = () => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
            }
        })
    }
    useEffect(() => {
        checkUser()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { marginBottom: 8 }]}>Facebook</Text>
            <Text style={[styles.title, { marginTop: 0 }]}>Auth Test</Text>

            <Btn t={'Facebook 登入'} f={() => { onLogIn() }} />
            <Btn t={'登出'} f={() => { onSignOut() }} />

            <TouchableOpacity
                style={styles.delete_TO}
                onPress={() => { onDelete() }}
            >
                <Text style={styles.t_delete}>Delete User</Text>
            </TouchableOpacity>
            <Button
                title={'check'}
                onPress={() => {
                    try { console.log(auth.currentUser) }
                    catch (err) { console.log(err) }
                }}
            />


            {!auth.currentUser ? null : <Text>{auth.currentUser.displayName}log in</Text>}
            {!auth.currentUser ? null :
                <Image
                    source={token ? { uri: `${auth.currentUser.photoURL}?height=500&access_token=${token}` } : null}
                    style={{ width: 50, height: 50, borderWidth: 1, }}
                />
            }
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
