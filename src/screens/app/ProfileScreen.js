import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAppSelector } from '../../redux/hooks'
import * as SecureStore from 'expo-secure-store';
import { storeBiometricData } from '../../apis/userAuthentication'
import { generateKeyPairSync } from '../../utils/keyGenerationWorker'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
    // Navigation
    const navigation = useNavigation();
    const route = useRoute();

    // States
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png');

    // Selectors
    const usernameSelector = useAppSelector(state => state.login.user.username);
    const emailSelector = useAppSelector(state => state.login.user.email);
    const avatarSelector = useAppSelector(state => state.login.user.photoURL);
    const token = useAppSelector(state => state.login.token);
    const userId = useAppSelector(state => state.login.user._id);

    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

    useEffect(() => {
        const checkBiometricPreference = async () => {
            const enabled = await SecureStore.getItemAsync('biometricEnabled');
            setIsBiometricEnabled(enabled === 'true');
        };
        checkBiometricPreference();
    }, []);

    const handleEnableBiometricAuth = async () => {
        await SecureStore.setItemAsync('biometricEnabled', 'true');
        const { publicKey, privateKey } = await generateKeyPairSync();
        await SecureStore.setItemAsync('biometricPrivateKey', privateKey);
        await SecureStore.setItemAsync('biometricPublicKey', publicKey);
        const res = await storeBiometricData({ publicKey }, token);
        if (res) {
            setIsBiometricEnabled(true);
            alert("Biometric Authentication Enabled");
        } else {
            alert("Error enabling Biometric Authentication");
        }
    }

    const handleDisableBiometricAuth = async () => {
        await SecureStore.setItemAsync('biometricEnabled', 'false');
        await SecureStore.deleteItemAsync('biometricPrivateKey');
        await SecureStore.deleteItemAsync('biometricPublicKey');
        const res = await storeBiometricData({ publicKey: null }, token);
        if (res) {
            setIsBiometricEnabled(false);
            alert("Biometric Authentication Disabled");
        } else {
            alert("Error disabling Biometric Authentication");
        }
    }

    // useEffect
    useEffect(() => {
        setUsername(usernameSelector);
        setEmail(emailSelector);
        setAvatar(avatarSelector);
    }, [usernameSelector, emailSelector, avatarSelector])

    useEffect(() => {
        if (route.params?.avatar) {
            setAvatar(route.params.avatar);
        }
    }, [route.params?.avatar])

    return (
        <View style={styles.container}>
            <View style={styles.empty} />
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Gallery")}>
                    <Avatar src={avatar} height={150} width={150} />
                </TouchableOpacity>
                <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.textInput} placeholderTextColor={'#7FFFAB'} />
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.textInput} placeholderTextColor={'#7FFFAB'} />
            </View>

            {!isBiometricEnabled ? <TouchableOpacity onPress={handleEnableBiometricAuth} style={styles.biometricButton}>
                <MaterialIcons name="fingerprint" size={24} color="#7FFFAB" />
                <Text style={styles.biometricButtonText}>
                    Enable Biometric</Text>
            </TouchableOpacity> :
                <TouchableOpacity onPress={handleDisableBiometricAuth} style={styles.biometricButton}>
                    <MaterialCommunityIcons name="fingerprint-off" size={24} color="#7FFFAB" />
                    <Text style={styles.biometricButtonText}>
                        Disable Biometric</Text>
                </TouchableOpacity>
            }

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    empty: {
        height: responsiveHeight(15),
    },
    container: {
        flex: 1,
        backgroundColor: '#09090b',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        marginVertical: 20,
        height: responsiveHeight(45)
    },
    textInput: {
        color: '#7FFFAB',
        borderBottomColor: '#7FFFAB',
        borderBottomWidth: 1,
        width: responsiveWidth(80),
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
    },
    button: {
        backgroundColor: '#7FFFAB',
        padding: 10,
        borderRadius: 5,
        height: responsiveHeight(7),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: responsiveWidth(80),
    },
    buttonText: {
        color: '#09090b',
        textAlign: 'center',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
    },
    buttonContainer: {
        height: responsiveHeight(20),
        justifyContent: 'flex-end',
    },
    biometricButton: {
        padding: 10,
        borderRadius: 5,
        height: responsiveHeight(7),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: responsiveWidth(80),
        color: '#7FFFAB',
        borderColor: '#7FFFAB',
        borderWidth: 1,
        backgroundColor: '#000000',
        textAlign: 'center',
        gap: 10,
    },
    biometricButtonText: {
        color: '#7FFFAB',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        textAlign: 'center',
    },
})