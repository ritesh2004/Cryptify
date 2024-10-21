import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { LoadingScreen } from './src/components/LoadingScreen';
import { HomeScreen } from './src/screens/app/HomeScreen';
import { SignupScreen } from './src/screens/authentication/SignupScreen';
import { LoginScreen } from './src/screens/authentication/LoginScreen';
import { GalleryScreen } from './src/screens/app/GalleryScreen';
import { ChatList } from './src/screens/app/ChatList';
import { ChatRoom } from './src/screens/app/ChatRoom';
import NavStacks from './src/navigations/NavStacks';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/navigations/Tabs';

export default function App() {
  const [loaded] = useFonts({
    'Montserrat-Bold': require('./assets/static/Montserrat-Bold.ttf'),
    'Montserrat-Regular': require('./assets/static/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('./assets/static/Montserrat-SemiBold.ttf'),
    'Montserrat-Light': require('./assets/static/Montserrat-Light.ttf'),
  });

  if (!loaded) {
    return <LoadingScreen />;
  }

  return (
    // <HomeScreen/>
    <SignupScreen/>
    // <LoginScreen/>
    // <GalleryScreen/>
    // <ChatList/>
    // <ChatRoom/>
    // <NavigationContainer>

    //   <NavStacks />
    //   {/* <Tabs/> */}
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
