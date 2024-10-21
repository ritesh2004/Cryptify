import React, { useState } from 'react'
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native'

export const Avatar = ({src,height,width}) => {
  const styles = StyleSheet.create({
    avatar: {
        width: width,
        height: height,
        borderRadius: 100,
    },
    image: {
        width: width,
        height: height,
        borderRadius: 100,
        borderColor: '#7FFFAB',
        borderWidth: 3,
    }
});
  return (
    <View style={styles.avatar}>
        {/* Avatar component */}
        <Image style={styles.image} source={{uri:src}} />
    </View>
  )
}