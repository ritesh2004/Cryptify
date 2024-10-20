import React, { useState } from 'react'
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native'

export const Avatar = ({src}) => {
  return (
    <View style={styles.avatar}>
        {/* Avatar component */}
        <Image style={styles.image} source={{uri:src}} />
    </View>
  )
}


const styles = StyleSheet.create({
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 100,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 100,
        borderColor: '#7FFFAB',
        borderWidth: 3,
    }
});