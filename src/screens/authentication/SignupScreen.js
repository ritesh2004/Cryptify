import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { Avatar } from '../../components/Avatar'
import { useNavigation, useRoute } from '@react-navigation/native'
import { register } from '../../apis/userAuthentication'

export const SignupScreen = () => {
    // Navigation
    const navigation = useNavigation();
    const route = useRoute();

    // States
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState('https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png');

    // Accept the avatar from the gallery screen
    useEffect(() => {
        if (route.params?.avatar) {
            setAvatar(route.params.avatar);
        }
    },[route.params?.avatar])

    // Functions
    // Check if the password and confirm password are the same
    const checkPassword = () => {
        if (password === confirmPassword) {
            return true;
        }
        return false;
    }

    // Check if the email is valid
    const checkEmail = () => {
        if (email.includes('@') && email.includes('.com')) {
            return true;
        }
        return false;
    }

    // Handle the sign up process
    const signUp = async () => {
        if (username.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            alert("Please fill in all the fields");
        } else if (!checkEmail()) {
            alert("Please enter a valid email address");
        } else if (!checkPassword()) {
            alert("Passwords do not match");
        } else {
            try {
                const data = await register({ username, email, password, photoURL: avatar });
                console.log(data);
                navigation.navigate('Login');
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Sign Up</Text>
                    <Text style={{ color: '#7FFFAB', fontFamily: 'Montserrat-Regular', fontSize: 18 }}>Create an account to continue</Text>
                </View>

                <View style={styles.formContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Gallery")}>
                        <Avatar src={avatar} height={90} width={90} />
                    </TouchableOpacity>
                    <TextInput placeholder="Username" style={styles.textInput} placeholderTextColor={'#7FFFAB'} value={username} onChangeText={setUsername} />
                    <TextInput placeholder="Email" style={styles.textInput} placeholderTextColor={'#7FFFAB'} value={email} onChangeText={setEmail}/>
                    <TextInput placeholder="Password" secureTextEntry={true} style={styles.textInput} placeholderTextColor={'#7FFFAB'} value={password} onChangeText={setPassword}/>
                    <TextInput placeholder="Confirm Password" secureTextEntry={true} style={styles.textInput} placeholderTextColor={'#7FFFAB'} value={confirmPassword} onChangeText={setConfirmPassword} />
                </View>

                <View style={{ height: responsiveHeight(10) }}>
                    <TouchableOpacity style={styles.button} onPress={signUp}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: responsiveHeight(10) }}>
                    <Text style={{ color: '#7FFFAB', fontFamily: 'Montserrat-Regular', fontSize: 18 }}>Already have an account? <Text onPress={()=>navigation.navigate('Login')} style={{ color: '#7FFFAB', fontFamily: 'Montserrat-Bold', fontSize: 18 }}>Login</Text></Text>
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