import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from './Avatar'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'

export const Chats = ({ recipient,socket }) => {
    const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.container} onPress={()=>navigation.navigate('Chatroom',{recipient,socket})}>
        <Avatar src={recipient?.photoURL} height={50} width={50} />
        <View style={styles.textContainer}>
            <Text style={styles.text}>{recipient?.username}</Text>
            <Text style={styles.lastSeen}>{recipient?.lastseen ? "Lastseen at " + moment(recipient?.lastseen).format('h:mm A, MMMM Do') : "Start your chat"}</Text>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2c2c2e',
        backgroundColor: '#09090b',
        height: responsiveHeight(10),
        width: responsiveWidth(100),
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'start',
        gap: 2
    },
    text: {
        color: '#7FFFAB',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold'
    },
    lastSeen: {
        color: '#7FFFAB',
        fontSize: 15,
        fontFamily: 'Montserrat-Light'
    }
})