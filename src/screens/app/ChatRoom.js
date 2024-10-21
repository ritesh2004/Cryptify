import React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Avatar } from '../../components/Avatar';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Feather from '@expo/vector-icons/Feather';

export const ChatRoom = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', gap: 10, padding: 10 }}>
            <Avatar
              src={'https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png'}
              height={50}
              width={50}
            />
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.name}>Jon Doe</Text>
              <Text style={styles.status}>Offline</Text>
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView style={styles.roomContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 5 }}>
            <View style={{ backgroundColor: '#e1ffc7', padding: 10, borderRadius: 10 }}>
              <Text style={styles.text}>Hello, how are you?</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 5 }}>
            <View style={{ backgroundColor: '#d1d1d1', padding: 10, borderRadius: 10 }}>
              <Text style={styles.text}>I'm good, thanks!</Text>
            </View>
          </View>
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message"
            style={{
              backgroundColor: '#495057',
              color: '#7FFFAB',
              padding: 10,
              borderRadius: 10,
              width: responsiveWidth(80),
              fontFamily: 'Montserrat-Regular',
            }}
            placeholderTextColor={'#7FFFAB'}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Feather name="send" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  headerContainer: {
    height: responsiveHeight(15),
    width: responsiveWidth(100),
    justifyContent: 'flex-end',
    backgroundColor: '#495057',
  },
  roomContainer: {
    flex: 1,
    width: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(2.5),
  },
  text: {
    color: '#09090b',
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'start',
  },
  name: {
    color: '#7FFFAB',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
  status: {
    color: '#7FFFAB',
    fontSize: 15,
    fontFamily: 'Montserrat-Light',
  },
  inputContainer: {
    width: responsiveWidth(100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    backgroundColor: '#09090b',
  },
  sendButton: {
    backgroundColor: '#7FFFAB',
    borderRadius: 100,
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
});