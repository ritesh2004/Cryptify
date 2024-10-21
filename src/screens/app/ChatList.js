import React from 'react'
import { FlatList, View, Text,StyleSheet } from 'react-native'
import { Chats } from '../../components/Chats'
import { responsiveHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions'

export const ChatList = () => {
    const chats = [1,2,3,4,5,6,7,8,9,10]
    return (
        <View style={styles.container}>
            {/* Chats */}
            <View style={styles.textContainer}>
                <Text style={styles.text}>Cryptify</Text>
            </View>

            <View style={styles.flatlist}>
                <FlatList 
                    data={chats}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => {
                        return (
                            <Chats/>
                        )
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        height: responsiveHeight(17),
        justifyContent: 'flex-end',
        backgroundColor: '#495057',
        width: responsiveWidth(100),
        padding: 15
    },
    text: {
        color: '#7FFFAB',
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'start',
    },
    flatlist: {
        height: responsiveHeight(95),
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        margin: 5
    },
    button: {
        backgroundColor: '#7FFFAB',
        padding: 10,
        borderRadius: 10,
        width: responsiveWidth(80),
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#09090b',
        fontSize: 20,
        fontFamily: 'Montserrat-Bold'
    }
})
