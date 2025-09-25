import React, { useContext, useEffect, useState } from 'react'
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Chats } from '../../components/Chats'
import { responsiveHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions'
import { fetchAllUsers } from '../../apis/fetchAllUsers'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { useSocketConnection } from '../../socket/useSockets'
import {useSQLiteContext} from 'expo-sqlite';
import { fetchChatsForUser } from '../../apis/fetchChatsForUser'
import { DecodeAll } from '../../utils/DecodeAll'
import { loadDatabase } from '../../utils/loadDatabase'
import { setDbName, setIsBackup } from '../../redux/slices/dbSlice'
import SockContext from '../../contexts/SockContext'
import AntDesign from '@expo/vector-icons/AntDesign';
import { logout } from '../../redux/slices/LoginSlice'
import { initializeDatabase } from '../../utils/databaseUtils'

export const ChatList = () => {
    // Database
    const db = useSQLiteContext();
    // States
    const [chats, setChats] = useState();
    const [isDbInitialized, setIsDbInitialized] = useState(false);

    // Selectors
    const selector = useAppSelector(state => state.login.token);
    const user = useAppSelector(state => state.login.user);
    const isBackedup = useAppSelector(state => state.db.isBackup);
    const dbName = useAppSelector(state => state.db.dbName);

    // Dispatch
    const dispatch = useAppDispatch();

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

    useEffect(() => {
        console.log("Token")
        console.log(selector);
    },[selector])

    // UseEffect
    useEffect(() => {
        fetchChats();
    }, [])

    // Fetch all data from local database
    useEffect(() => {
        if (!isBackedup) return;
        if (!isDbInitialized) return;
        const fetchData = async () => {
            const chats = await db.getAllAsync('SELECT * FROM chats;');
        };
        fetchData();
        console.log("Chats");
        console.log(chats);
    },[isBackedup, isDbInitialized])

    // Load data from Remote Database to Local Database
    useEffect(() => {
        if (isBackedup) return;
        if (!isDbInitialized) return;
        loadDatabase(db, user, selector);
        dispatch(setIsBackup(true));
        console.log("Data Loaded");
    },[isBackedup, isDbInitialized])

    const handleLogout = () => {
        dispatch(logout());
    }

    // Fetching socket connection
    // const { socket, status, socketId, isConnected } = useSocketConnection(user?.id);

    // const { setSocket } = useContext(SockContext);

    // setSocket(socket);

    return (
        <View style={styles.container}>
            {/* Chats */}
            <View style={styles.textContainer}>
                <Text style={styles.text}>Cryptify</Text>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <AntDesign name="logout" size={24} color="#ff0000ff" />
                </TouchableOpacity>
            </View>

            <View style={styles.flatlist}>
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <Chats recipient={item} />
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#495057',
        width: responsiveWidth(100),
        padding: 15,
        paddingTop: responsiveHeight(5)
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
    },
    logoutButton: {
        backgroundColor: '#7FFFAB',
        padding: 10,
        borderRadius: 10,
        width: responsiveWidth(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
})
