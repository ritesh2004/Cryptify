import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Avatar } from '../../components/Avatar';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Feather from '@expo/vector-icons/Feather';
import { useRoute } from '@react-navigation/native';
import { useAppSelector } from '../../redux/hooks';
import { encrypt } from '../../utils/encryption';
import { decrypt } from '../../utils/decryption';
import { fetchAllMessages } from '../../apis/fetchAllmessages';
import { postMessage } from '../../apis/postMessage';
import { useSocketConnection } from '../../socket/useSockets';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  insertRealtimeMessage,
  getMessagesForUsers
} from '../../utils/databaseUtils';
import SockContext from '../../contexts/SockContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSQLiteContext } from 'expo-sqlite';

export const ChatRoom = () => {
  // Navigation
  const route = useRoute();

  // States
  const [avatar, setAvatar] = useState('https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png');
  const [username, setUsername] = useState('Jon Doe');
  const [recipient, setRecipient] = useState(null);
  // const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [allmessages, setAllMessages] = useState([]);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msgLength, setMsgLength] = useState(0);

  const db = useSQLiteContext();

  // Socket connection
  const { socket } = useSocketConnection(user?.id);

  // Flatlist ref
  const flatListRef = useRef(null);

  // Selectors for user and token
  const selectorToken = useAppSelector(state => state.login.token);
  const selectorUser = useAppSelector(state => state.login.user);

  // Fucntions
  // Encrypt message
  const encryptMessage = useCallback((message) => {
    const encodedMessage = encrypt(message, recipient?.publicKey, user);
    return encodedMessage;
  }, [recipient, user]);

  // Decrypt message
  const decryptMessage = useCallback((encryptedMessage, isMe) => {
    const decodedMessage = decrypt(encryptedMessage, user, isMe);
    return decodedMessage;
  }, [user]);

  // Send message
  const sendMessage = async () => {
    try {
      if (!message || !db) return;

      const messageToSend = message;
      setMessage("");

      // Add message to UI immediately
      setAllMessages((prev) => [...prev, { message: messageToSend, recipaent: recipient }]);

      // Store decrypted message in local database
      await insertRealtimeMessage(db, user?.id, recipient?.id, messageToSend);

      // Encrypt message for transmission
      const encryptedMessage = encryptMessage(messageToSend);
      if (!encryptedMessage) {
        console.error("Failed to encrypt message");
        return;
      }

      socket.emit("send-message", {
        message: encryptedMessage,
        recipaent: recipient,
      });

      await postMessage(user?.id, recipient?.id, encryptedMessage, token);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetching status
  const { status } = useSocketConnection(user?.id);

  //useEffect
  useEffect(() => {
    if (route.params?.recipient) {
      setRecipient(route.params?.recipient);
      // setSocket(route.params?.socket);
    }
  }, [route.params?.recipient]);

  useEffect(() => {
    setUser(selectorUser);
    setToken(selectorToken);
  }, [selectorUser, selectorToken]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !recipient || !token || !db) return;

      try {
        // First, try to load messages from local database
        const localMessages = await getMessagesForUsers(db, user.id, recipient.id);

        if (localMessages && localMessages.length > 0) {
          // Convert local messages to UI format
          const formattedLocalMessages = localMessages.map((msg) => ({
            message: msg.message,
            recipaent: {
              email: msg.from_id === user.id ? recipient.email : user.email
            },
          }));
          setAllMessages(formattedLocalMessages);
          console.log(`Loaded ${localMessages.length} messages from local database`);
        } else {
          // Fallback: fetch from server and decrypt
          console.log("No local messages found, fetching from server...");
          setIsLoading(true);
          const data = await fetchAllMessages(user?.id, recipient?.id, token);

          console.log("Fetched messages from server:", data);

          if (data?.chats) {
            setIsLoading(false);
            setIsDecoding(true);
            setMsgLength(data.chats.length);
            const messages = data.chats.map((msg) => {
              if (msg.from_id === user.id) {
                return {
                  message: decryptMessage(msg.message, true),
                  recipaent: { email: recipient.email },
                };
              } else {
                return {
                  message: decryptMessage(msg.message, false),
                  recipaent: { email: user.email },
                };
              }
            });
            setAllMessages(messages);

            // Store fetched messages in local database
            messages.forEach(async (msg, index) => {
              await insertRealtimeMessage(db, msg.recipaent.email === recipient.email ? user.id : recipient.id, msg.recipaent.email === recipient.email ? recipient.id : user.id, msg.message);
            });
            setIsDecoding(false);
            console.log(`Loaded ${messages.length} messages from server`);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    fetchMessages();
  }, [recipient, user, token, db]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (flatListRef.current && allmessages.length) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [allmessages]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket || !db) return;

    const handleReceiveMessage = async (msg) => {
      try {
        // console.log("Received message:", msg);
        const decryptedMessage = decryptMessage(msg.message, false);
        if (decryptedMessage) {
          // Add to UI
          // console.log("Decrypted message:", decryptedMessage);
          setAllMessages((prev) => [
            ...prev,
            { message: decryptedMessage, recipaent: msg.recipaent },
          ]);
          // console.log(msg);
          // Store decrypted message in local database
          await insertRealtimeMessage(db, recipient?.id, user?.id, decryptedMessage);
        }
      } catch (error) {
        console.error("Error handling received message:", error);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, db, user]);


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', gap: 10, padding: 10 }}>
            <Avatar
              src={recipient?.photoURL}
              height={50}
              width={50}
            />
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.name}>{recipient?.username}</Text>
              <Text style={styles.status}>{status?.includes(recipient?.id) ? "Online" : "Offline"}</Text>
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        <View style={styles.roomContainer}>
          {!allmessages.length == 0 ? <FlatList
            data={allmessages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <View style={{ flexDirection: 'row', justifyContent: item.recipaent.email !== user.email ? 'flex-end' : 'flex-start' }}>
                  <View style={{ backgroundColor: item.recipaent.email !== user.email ? '#e1ffc7' : '#d1d1d1', padding: 10, borderRadius: 10, margin: 5 }}>
                    <Text style={styles.text}>{item.message}</Text>
                  </View>
                </View>
              );
            }}
            ref={flatListRef}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
          /> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <AntDesign name="cloud-download" size={50} color="#7FFFAB" />
            <Text style={{ color: '#7FFFAB', marginTop: 10 }}>{isLoading ? `Loading messages...` : isDecoding ? `Decrypting ${msgLength} messages...` : `No messages found`}</Text>
          </View>
          }
        </View>

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
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
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
    height: responsiveHeight(10),
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