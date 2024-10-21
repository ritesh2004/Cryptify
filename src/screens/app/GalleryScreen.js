import React, { useState } from 'react'
import { FlatList, StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { Avatar } from '../../components/Avatar'
import { useNavigation } from '@react-navigation/native'

export const GalleryScreen = () => {
    const navigation = useNavigation();
    const [selectedAvatar, setSelectedAvatar] = useState(null)
    const avatars = [
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728654519/chatapp-avatars/Avatar_for_Chat_App_x3u1jz.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/6_aw5ehm.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644228/chatapp-avatars/7_igflj0.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644228/chatapp-avatars/8_hq5dbl.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644228/chatapp-avatars/5_eum1cs.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644228/chatapp-avatars/1_dp0hq1.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644227/chatapp-avatars/4_hmna3n.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644227/chatapp-avatars/2_stzpcm.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644227/chatapp-avatars/3_yy6eby.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644226/chatapp-avatars/12_jl1gda.png",
        "https://res.cloudinary.com/drctt42py/image/upload/v1728644225/chatapp-avatars/11_tyatgy.png"
    ]
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Select Your Avatar</Text>
            </View>

            <View style={styles.flatlist}>
                <FlatList
                    data={avatars}
                    keyExtractor={(item) => item}
                    numColumns={3}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.avatar} onPress={()=>setSelectedAvatar(item)}><Avatar src={
                                selectedAvatar !== item ? item : "https://res.cloudinary.com/drctt42py/image/upload/v1728703895/chatapp-avatars/Avatar_for_Chat_App_1_vccnkb.png"
                            } height={90} width={90} /></TouchableOpacity> 
                        )
                    }}
                />
            </View>

            <View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Select Avatar</Text>
                </TouchableOpacity>
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
        height: responsiveHeight(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#7FFFAB',
        fontSize: 30,
        fontFamily: 'Montserrat-Bold'
    },
    flatlist: {
        height: responsiveHeight(70),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
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
    avatar: {
        marginHorizontal: 8,
        marginVertical: 15
    },
})
