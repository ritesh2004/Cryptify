import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/app/HomeScreen';
import { ChatList } from '../screens/app/ChatList';
import { LoginScreen } from '../screens/authentication/LoginScreen';
import { SignupScreen } from '../screens/authentication/SignupScreen';
import Tabs from './Tabs';
import { ChatRoom } from '../screens/app/ChatRoom';
import { GalleryScreen } from '../screens/app/GalleryScreen';
import { useAppSelector } from '../redux/hooks';
import { clearPersistedStorage } from '../redux/store';

const Stack = createNativeStackNavigator();

const NavStacks = () => {
  const isLoggedIn = useAppSelector(state => state.login.isLoggedIn);

  if (!isLoggedIn) {
    return (
      <Stack.Navigator initialRouteName='AuthHome'
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Gallery" component={GalleryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AuthHome" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
  }
  // clearPersistedStorage();
  return (
      <Stack.Navigator initialRouteName='Tabs'
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Chatroom" component={ChatRoom} options={{ headerShown: false }} />
        <Stack.Screen name="Gallery" component={GalleryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
  )

}

export default NavStacks