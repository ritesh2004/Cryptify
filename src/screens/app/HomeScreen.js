import LottieView from 'lottie-react-native';
import React from 'react';
import { View,Text, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
        <View>
            <Text style={styles.appTitle}>Cryptify</Text>
        </View>

        <View style={styles.appAnimation}>
            <Text style={{color: 'white', fontSize: 20, fontFamily:'Montserrat-SemiBold'}}>End-to-End Encrypted Chat App</Text>
            <LottieView style={{flex:1}} source={require('../../../assets/animations/welcome.json')} autoPlay loop />
        </View>

        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={{color: 'white', textAlign: 'center'}}>OR</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.buttonText}>Sign Up</Text>
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
  appTitle: {
    color: '#7FFFAB',
    fontSize: 30,
    fontFamily: 'Montserrat-Bold',
    height: responsiveHeight(10),
  },
  appAnimation: {
    height: responsiveHeight(60)
  },
  buttonContainer: {
    height: responsiveHeight(20),
    flexDirection: 'col',
    justifyContent: 'space-around',
    width: responsiveWidth(90),
    marginTop: 20,
  },
  button: {
    backgroundColor: '#7FFFAB',
    // padding: 10,
    borderRadius: 5,
    height: responsiveHeight(7),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#09090b',
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
  }
})
