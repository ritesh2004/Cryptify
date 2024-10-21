import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from './Avatar'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { useNavigation } from '@react-navigation/native'

export const Chats = () => {
    const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.container} onPress={()=>navigation.navigate('Chatroom')}>
        <Avatar src={'https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png'} height={50} width={50} />
        <View style={styles.textContainer}>
            <Text style={styles.text}>Jon Doe</Text>
            <Text style={styles.lastSeen}>Start Chat</Text>
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
        alignItems: 'center',
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