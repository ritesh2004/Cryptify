import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { updateUserProfile } from '../../redux/slices/LoginSlice';
import { updateProfile } from '../../apis/updateProfile';
import * as SecureStore from 'expo-secure-store';
import { storeBiometricData } from '../../apis/userAuthentication'
import { generateKeyPairSync } from '../../utils/keyGenerationWorker'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as LocalAuthentication from 'expo-local-authentication';
import { usePushNotifications } from '../../hooks/usePushNotifications'
import { uploadPushToken, deleteToken } from '../../apis/notification'

const ProfileScreen = () => {
    // Navigation
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useAppDispatch();

    // Get user data from Redux store
    const user = useAppSelector(state => state.login.user);
    const token = useAppSelector(state => state.login.token);

    // States
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatar, setAvatar] = useState(user?.photoURL || 'https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png');

    // Selectors
    const userId = user?._id;

    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

    useEffect(() => {
        const checkBiometricSupport = async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (compatible) {
                const enrolled = await LocalAuthentication.isEnrolledAsync();
                setIsBiometricSupported(enrolled);
                return;
            }
            setIsBiometricSupported(compatible);
        };
        checkBiometricSupport();
    }, []);

    useEffect(() => {
        const checkBiometricPreference = async () => {
            const enabled = await SecureStore.getItemAsync('biometricEnabled');
            setIsBiometricEnabled(enabled === 'true');
        };
        checkBiometricPreference();
    }, []);

    useEffect(() => {
        const checkNotificationPreference = async () => {
            const enabled = await SecureStore.getItemAsync('notification_enabled');
            setIsNotificationEnabled(enabled === 'true');
        };
        checkNotificationPreference();
    }, []);

    const handleEnableBiometricAuth = async () => {
        if (!isBiometricSupported) {
            alert("Biometric authentication is not supported on this device");
            return;
        }
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Enable Biometric Authentication',
            fallbackLabel: 'Enter Passcode',
            disableDeviceFallback: false,
            cancelLabel: 'Cancel',
        });
        if (!result.success) {
            alert("Biometric authentication failed");
            return;
        }
        await SecureStore.setItemAsync('biometricEnabled', 'true');
        const { publicKey, privateKey } = await generateKeyPairSync();
        await SecureStore.setItemAsync('biometricPrivateKey', privateKey);
        await SecureStore.setItemAsync('biometricPublicKey', publicKey);
        const res = await storeBiometricData({ publicKey }, token);
        if (res) {
            setIsBiometricEnabled(true);
            alert("Biometric Authentication Enabled");
        } else {
            alert("Error enabling Biometric Authentication");
        }
    }

    const handleDisableBiometricAuth = async () => {
        await SecureStore.setItemAsync('biometricEnabled', 'false');
        await SecureStore.deleteItemAsync('biometricPrivateKey');
        await SecureStore.deleteItemAsync('biometricPublicKey');
        const res = await storeBiometricData({ publicKey: null }, token);
        if (res) {
            setIsBiometricEnabled(false);
            alert("Biometric Authentication Disabled");
        } else {
            alert("Error disabling Biometric Authentication");
        }
    }

    const handleSaveChanges = async () => {
        try {
            // Update local state first for immediate feedback
            const updatedUser = {
                ...user,
                username,
                email,
                photoURL: avatar
            };

            // Update Redux store
            dispatch(updateUserProfile({
                username,
                email,
                photoURL: avatar
            }));
            // console.log("Updated User", {
            //     username,
            //     email,
            //     photoURL: avatar
            // });
            // Update backend
            const response = await updateProfile({
                username,
                email,
                photoURL: avatar
            }, token);

            if (response.success) {
                alert('Profile updated successfully!');
            } else {
                // Revert local changes if API call fails
                setUsername(user.username);
                setEmail(user.email);
                setAvatar(user.photoURL);
                alert(response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            // Revert local changes on error
            setUsername(user.username);
            setEmail(user.email);
            setAvatar(user.photoURL);
            alert('An error occurred while updating your profile');
        }
    };

    // Upload push token for notification
    const expoPushToken = usePushNotifications();

    const enableNotification = async () => {
        try {
            if (!expoPushToken || !user?.id) {
                console.log('Push token or user ID not available yet');
                return;
            }

            const notificationInfo = await SecureStore.getItemAsync('notification_enabled');
            const notificationInfoParsed = notificationInfo ? JSON.parse(notificationInfo) : null;

            // Only proceed if notifications aren't already enabled or if we don't have the info
            if (!notificationInfoParsed?.isEnabled) {
                console.log('Uploading push token to server...');
                const response = await uploadPushToken(
                    { token: expoPushToken, userId: user.id },
                    token
                );

                if (response?.status === 200) {
                    console.log('Push token uploaded successfully');
                    await SecureStore.setItemAsync('notification_enabled', JSON.stringify({
                        isEnabled: true,
                        lastUpdated: new Date().toISOString()
                    }));
                    setIsNotificationEnabled(true);
                } else {
                    console.log('Failed to upload push token:', response?.message || 'Unknown error');
                    alert(response?.message || 'Failed to upload push token');
                }
            } else {
                console.log('Notifications already enabled');
            }
        } catch (error) {
            console.error('Error in enableNotification:', error);
            // Don't show alert to avoid annoying users with errors
        }
    }

    const disableNotification = async () => {
      try {
        if (!user?.id) {
          console.log('User ID not available');
          return;
        }

        console.log('Deleting push token from server...');
        const response = await deleteToken(
          { userId: user.id },
          token
        );

        if (response?.status === 200) {
          console.log('Push token deleted successfully');
          await SecureStore.setItemAsync('notification_enabled', JSON.stringify({
            isEnabled: false,
            lastUpdated: new Date().toISOString()
          }));
          setIsNotificationEnabled(false);
          alert('Notifications have been disabled');
        } else {
          console.log('Failed to delete push token:', response?.message || 'Unknown error');
          alert('Failed to disable notifications. Please try again.');
        }
      } catch (error) {
        console.error('Error in disableNotification:', error);
        alert('An error occurred while disabling notifications');
      }
    }

    // Check notification status on mount
    useEffect(() => {
      const checkNotificationStatus = async () => {
        try {
          const notificationInfo = await SecureStore.getItemAsync('notification_enabled');
          const notificationInfoParsed = notificationInfo ? JSON.parse(notificationInfo) : null;
          setIsNotificationEnabled(notificationInfoParsed?.isEnabled || false);
        } catch (error) {
          console.error('Error checking notification status:', error);
        }
      };
      checkNotificationStatus();
    }, []);

    // Update local state when user data changes
    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setAvatar(user.photoURL || 'https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png');
        }
    }, [user])

    // Update avatar when selected from gallery
    useEffect(() => {
        if (route.params?.avatar) {
            setAvatar(route.params.avatar);
        }
    }, [route.params?.avatar])

    return (
        <View style={styles.container}>
            <View style={styles.empty} />
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Gallery", { from: 'profile', initialAvatar: avatar })}>
                    <Avatar src={avatar} height={150} width={150} />
                </TouchableOpacity>
                <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.textInput} placeholderTextColor={'#7FFFAB'} editable={false} />
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.textInput} placeholderTextColor={'#7FFFAB'} editable={false} />
            </View>

            {!isBiometricEnabled ? <TouchableOpacity onPress={handleEnableBiometricAuth} style={styles.biometricButton}>
                <MaterialIcons name="fingerprint" size={24} color="#7FFFAB" />
                <Text style={styles.biometricButtonText}>
                    Enable Biometric</Text>
            </TouchableOpacity> :
                <TouchableOpacity onPress={handleDisableBiometricAuth} style={styles.biometricButton}>
                    <MaterialCommunityIcons name="fingerprint-off" size={24} color="#7FFFAB" />
                    <Text style={styles.biometricButtonText}>
                        Disable Biometric</Text>
                </TouchableOpacity>
            }

                {isNotificationEnabled ? (
                    <TouchableOpacity
                        style={[styles.biometricButton, { backgroundColor: '#ff4d4f', marginTop: 8 }]}
                        onPress={disableNotification}
                        disabled={!username || !email}
                    >
                        <MaterialCommunityIcons name="bell-off" size={24} color="#fff" />
                        <Text style={[styles.biometricButtonText, { color: '#fff' }]}>Disable Notifications</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.biometricButton, { backgroundColor: '#7FFFAB', marginTop: 8 }]}
                        onPress={enableNotification}
                        disabled={!username || !email}
                    >
                        <MaterialCommunityIcons name="bell" size={24} color="#09090b" />
                        <Text style={[styles.biometricButtonText, { color: '#09090b' }]}>Enable Notifications</Text>
                    </TouchableOpacity>
                )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSaveChanges}
                    disabled={!username || !email}
                >
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    empty: {
        height: responsiveHeight(10),
    },
    container: {
        flex: 1,
        backgroundColor: '#09090b',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        marginVertical: 20,
        height: responsiveHeight(45)
    },
    textInput: {
        color: '#7FFFAB',
        borderBottomColor: '#7FFFAB',
        borderBottomWidth: 1,
        width: responsiveWidth(80),
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
    },
    button: {
        backgroundColor: '#7FFFAB',
        padding: 10,
        borderRadius: 5,
        height: responsiveHeight(7),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: responsiveWidth(80),
    },
    buttonText: {
        color: '#09090b',
        textAlign: 'center',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
    },
    buttonContainer: {
        height: responsiveHeight(15),
        justifyContent: 'flex-end',
    },
    biometricButton: {
        padding: 10,
        borderRadius: 5,
        height: responsiveHeight(7),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: responsiveWidth(80),
        color: '#7FFFAB',
        borderColor: '#7FFFAB',
        borderWidth: 1,
        backgroundColor: '#000000',
        textAlign: 'center',
        gap: 10,
    },
    biometricButtonText: {
        color: '#7FFFAB',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        textAlign: 'center',
    },
})