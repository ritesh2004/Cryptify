import { View, Text } from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/app/HomeScreen';
import { ChatList } from '../screens/app/ChatList';
import { LoginScreen } from '../screens/authentication/LoginScreen';
import { SignupScreen } from '../screens/authentication/SignupScreen';
import Tabs from './Tabs';
import { ChatRoom } from '../screens/app/ChatRoom';
import { GalleryScreen } from '../screens/app/GalleryScreen';

const Stack = createNativeStackNavigator();

const NavStacks = () => {
  return (
    // <NavigationContainer>
        <Stack.Navigator initialRouteName='TabScreen'>
            <Stack.Screen name="TabScreen" component={Tabs} options={{headerShown:false}} />
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown:false}} />
            <Stack.Screen name="Chatroom" component={ChatRoom} options={{headerShown:false}} />
            <Stack.Screen name="Gallery" component={GalleryScreen} options={{headerShown:false}} />
        </Stack.Navigator>
    // </NavigationContainer>
  )
}

export default NavStacks