import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'

export default function Btn(props) {
    return (
        <TouchableOpacity
            style={[styles.TO, props.style]}
            onPress={props.f}
        >
            <Text style={styles.t}>{props.t}</Text>
        </TouchableOpacity>
    )
}

Btn.propType = {
    t: PropTypes.string,
    style: PropTypes.object,
    f: PropTypes.func
}

const styles = StyleSheet.create({
    TO: {
        width: 200,
        height: 50,
        // borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D1F5FF',
        elevation: 2,
        marginBottom: 20,
    },
    t: {
        fontSize: 20
    }
})
