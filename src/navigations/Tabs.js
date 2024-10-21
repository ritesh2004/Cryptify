import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ChatList } from '../screens/app/ChatList';
import { ChatRoom } from '../screens/app/ChatRoom';
import Feather from '@expo/vector-icons/Feather';
import ProfileScreen from '../screens/app/ProfileScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator initialRouteName='Home'
            screenOptions={({route})=>({
                tabBarIcon: ({focused}) => {
                    let iconName;
                    if(route.name === 'Home'){
                        iconName = 'home'
                    }else if(route.name === 'Profile'){
                        iconName = 'user'
                    }
                    return <Feather name={iconName} size={20} color={focused ? '#7FFFAB' : '#495057'}/>
                },
                tabBarActiveTintColor: '#7FFFAB',
                tabBarInactiveTintColor: '#495057',
                tabBarStyle: {
                    backgroundColor: '#09090b',
                    borderTopWidth: 0
                }
            })}
        >
            <Tab.Screen name="Home" options={{headerShown:false}} component={ChatList} />
            <Tab.Screen name="Profile" options={{headerShown:false}} component={ProfileScreen} />
        </Tab.Navigator>
    )
}

export default Tabs