import React, { useEffect, useState } from 'react'
import { FlatList, View, Text, StyleSheet } from 'react-native'
import { Chats } from '../../components/Chats'
import { responsiveHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions'
import { fetchAllUsers } from '../../apis/fetchAllUsers'
import { useAppSelector } from '../../redux/hooks'
import { useSocketConnection } from '../../socket/useSockets'

export const ChatList = () => {
    // States
    const [chats, setChats] = useState();

    // Selectors
    const selector = useAppSelector(state => state.token);
    const user = useAppSelector(state => state.user);

    // Functions
    // Fetch chats
    const fetchChats = async () => {
        try {
            // Fetch chats
            const data = await fetchAllUsers(selector);
            // console.log(data);
            setChats(data?.users);
        } catch (error) {
            console.log(error);
        }
    }

    // UseEffect
    useEffect(() => {
        fetchChats();
    }, [])

    // Fetching socket connection
    const { socket, status, socketId, isConnected } = useSocketConnection(user?.id);

    return (
        <View style={styles.container}>
            {/* Chats */}
            <View style={styles.textContainer}>
                <Text style={styles.text}>Cryptify</Text>
            </View>

            <View style={styles.flatlist}>
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <Chats recipient={item} socket={socket} />
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
        height: responsiveHeight(14),
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
        height: responsiveHeight(85),
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
