import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Avatar } from '../../components/Avatar'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { useNavigation } from '@react-navigation/native'

const ProfileScreen = () => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <View style={styles.empty} />
            <View style={styles.inputContainer}>
            <TouchableOpacity onPress={()=>navigation.navigate("Gallery")}>
                <Avatar src={'https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png'} height={150} width={150} />
            </TouchableOpacity>
                <TextInput placeholder="Username" style={styles.textInput} placeholderTextColor={'#7FFFAB'}/>
                <TextInput placeholder="Email" style={styles.textInput} placeholderTextColor={'#7FFFAB'}/>
            </View>

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
    }
})