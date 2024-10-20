import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { LoadingScreen } from './src/components/LoadingScreen';
import { HomeScreen } from './src/screens/app/HomeScreen';
import { SignupScreen } from './src/screens/authentication/SignupScreen';
import { LoginScreen } from './src/screens/authentication/LoginScreen';
import { GalleryScreen } from './src/screens/app/GalleryScreen';

export default function App() {
  const [loaded] = useFonts({
    'Montserrat-Bold': require('./assets/static/Montserrat-Bold.ttf'),
    'Montserrat-Regular': require('./assets/static/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('./assets/static/Montserrat-SemiBold.ttf'),
    'Montserrat-Light': require('./assets/static/Montserrat-Light.ttf'),
  });

  if (!loaded) {
    return <LoadingScreen/>;
  }

  return (
    // <HomeScreen/>
    // <SignupScreen/>
    // <LoginScreen/>
    <GalleryScreen/>
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
