import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { login, verifyBiometricData } from '../../apis/userAuthentication';
import { loginSuccess } from '../../redux/slices/LoginSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import forge from 'node-forge';
import dayjs from 'dayjs';

export const LoginScreen = () => {
    // Navigation
    const navigation = useNavigation();
    // States
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Biometric Authentication
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkBiometricPreference = async () => {
            const enabled = await SecureStore.getItemAsync('biometricEnabled');
            setIsBiometricEnabled(enabled === 'true');
        };
        checkBiometricPreference();
    }, []);

    useEffect(() => {
        const checkBiometricSupport = async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (compatible) {
                const enrolled = await LocalAuthentication.isEnrolledAsync();
                setIsBiometricSupported(enrolled);
                return;
            }
            setIsBiometricSupported(compatible);
        };
        checkBiometricSupport();
    }, []);

    useEffect(() => {
        if (isBiometricSupported && isBiometricEnabled) {
            handleBiometricAuth();
        }
    }, [isBiometricSupported]);

    const handleBiometricAuth = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login with Biometrics',
            fallbackLabel: 'Enter Passcode',
            disableDeviceFallback: false,
            cancelLabel: 'Cancel',
        });

        if (result.success) {
            // Handle successful authentication
            setIsLoading(true);
            console.log('Authentication successful');
            const storedUser = await SecureStore.getItemAsync('user');
            const privateKey = await SecureStore.getItemAsync('biometricPrivateKey');
            if (storedUser && privateKey) {
                const user = JSON.parse(storedUser);
                console.log("Stored User: ", user);
                const payload = { user: user?.id, exp: dayjs().add(10, 'minutes').unix() };
                const md = forge.md.sha256.create();
                md.update(JSON.stringify(payload), 'utf8');
                const privateKeyForge = forge.pki.privateKeyFromPem(privateKey);
                const signature = forge.util.encode64(privateKeyForge.sign(md));
                const data = await verifyBiometricData({ payload, signature });

                if (data) {
                    // console.log("Biometric login successful: ", data);
                    dispatch(loginSuccess(data));
                    setUser('');
                    setPassword('');
                    setErrorMessage('');
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                    alert("Biometric authentication failed. Please log in manually.");
                }
            }
            else {
                setIsLoading(false);
                alert("Biometric keys or user data not found. Please log in manually.");
            }
        } else {
            // Handle failed authentication
            console.log('Authentication failed');
        }
    };

    // Dispatch
    const dispatch = useAppDispatch();
    // Selector
    const selector = useAppSelector(state => state.login.token);
    useEffect(() => {
        console.log(selector);
    }, [selector])

    // Functions
    // Handle the login process
    const Login = async () => {
        try {
            const data = await login({ user, password });
            console.log("Success: ", data);

            if (!data) {
                setErrorMessage('Invalid username or password');
                return;
            }

            dispatch(loginSuccess(data));
            setUser('');
            setPassword('');
        } catch (error) {
            console.log("Error: ", error);
            setErrorMessage('Invalid username or password');
        }
    }

    if (isLoading) {
        return <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090b' }}>
            <ActivityIndicator size="large" color="#7FFFAB" />
        </SafeAreaView>;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Log In</Text>
                    <Text style={{ color: '#7FFFAB', fontFamily: 'Montserrat-Regular', fontSize: 18 }}>Log in to your account</Text>
                </View>

                <View style={styles.formContainer}>
                    <TextInput placeholder="Username or Email" value={user} onChangeText={setUser} style={styles.textInput} placeholderTextColor={'#7FFFAB'} />
                    <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.textInput} placeholderTextColor={'#7FFFAB'} />
                    {errorMessage.length > 0 && <Text style={{ color: 'red', fontFamily: 'Montserrat-Regular', fontSize: 16 }}>{errorMessage}</Text>}
                </View>


                <View style={{ height: responsiveHeight(10) }}>
                    <TouchableOpacity style={styles.button} onPress={Login}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: responsiveHeight(10) }}>
                    <Text style={{ color: '#7FFFAB', fontFamily: 'Montserrat-Regular', fontSize: 18 }}>Don't have an account? <Text onPress={() => navigation.navigate('Signup')} style={{ color: '#7FFFAB', fontFamily: 'Montserrat-Bold', fontSize: 18 }}>Create One</Text></Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        height: responsiveHeight(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#7FFFAB',
        fontSize: 30,
        fontFamily: 'Montserrat-Bold'
    },
    formContainer: {
        height: responsiveHeight(60),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
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
    }
})