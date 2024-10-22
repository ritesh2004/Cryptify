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
import { Provider } from 'react-redux';
import store from './src/redux/store';

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

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
    // <SignupScreen/>
    // <LoginScreen/>
    // <GalleryScreen/>
    // <ChatList/>
    // <ChatRoom/>
    <Provider store={store}>
      <NavigationContainer>

        <NavStacks />
        {/* <Tabs/> */}
      </NavigationContainer>
    </Provider>
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
