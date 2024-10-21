import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { Avatar } from '../../components/Avatar'
import { useNavigation } from '@react-navigation/native'

export const SignupScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Sign Up</Text>
                    <Text style={{ color: '#7FFFAB', fontFamily: 'Montserrat-Regular', fontSize: 18 }}>Create an account to continue</Text>
                </View>

                <View style={styles.formContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Gallery")}>
                        <Avatar src={"https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png"} height={90} width={90} />
                    </TouchableOpacity>
                    <TextInput placeholder="Username" style={styles.textInput} placeholderTextColor={'#7FFFAB'} />
                    <TextInput placeholder="Email" style={styles.textInput} placeholderTextColor={'#7FFFAB'} />
                    <TextInput placeholder="Password" secureTextEntry={true} style={styles.textInput} placeholderTextColor={'#7FFFAB'} />
                    <TextInput placeholder="Confirm Password" secureTextEntry={true} style={styles.textInput} placeholderTextColor={'#7FFFAB'} />
                </View>

                <View style={{ height: responsiveHeight(10) }}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: responsiveHeight(10) }}>
                    <Text style={{ color: '#7FFFAB', fontFamily: 'Montserrat-Regular', fontSize: 18 }}>Already have an account? <Text style={{ color: '#7FFFAB', fontFamily: 'Montserrat-Bold', fontSize: 18 }}>Login</Text></Text>
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