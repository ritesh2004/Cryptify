import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { parseISO } from 'date-fns';
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
  getMessagesForUsers,
  batchInsertMessages,
  getSyncInfo,
  updateSyncInfo
} from '../../utils/databaseUtils';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSQLiteContext } from 'expo-sqlite';
import { sendNotification } from '../../apis/notification';
import { useSocket } from '../../contexts/SocketContext';

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
  // const { socket } = useSocketConnection(user?.id, null);
  const { getSocket, isUserOnline } = useSocket();
  const socket = getSocket();
  const isOnline = isUserOnline(recipient?.id);
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

      // Note: Don't update sync_info here - only update from server timestamps to maintain consistency
      // Encrypt message for transmission
      const encryptedMessage = encryptMessage(messageToSend);
      if (!encryptedMessage) {
        console.error("Failed to encrypt message");
        return;
      }
      
      socket.emit("send-message", {
        message: encryptedMessage,
        to: recipient,
      });
      
      // Store decrypted message in local database
      const timestamp = new Date().toISOString();
      // console.log(timestamp)
      await insertRealtimeMessage(db, user?.id, recipient?.id, messageToSend, timestamp);
      // await postMessage(user?.id, recipient?.id, encryptedMessage, token);

      await sendNotification({
        userId: recipient?.id,
        title: `${user?.username} texted you`,
        body: messageToSend
      }, selectorToken)
    } catch (error) {
      console.log(error);
    }
  };

  //useEffect
  useEffect(() => {
    if (route.params?.recipient) {
      setRecipient(route.params?.recipient);
      // setIsOnline(route.params?.isOnline);
    }
  }, [route.params?.recipient, route.params?.isOnline]);

  useEffect(() => {
    setUser(selectorUser);
    setToken(selectorToken);
  }, [selectorUser, selectorToken]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !recipient || !token || !db) return;

      try {
        setIsLoading(true);
        // Generate Chat ID
        const chatId = `${user.id}_${recipient.id}`;
        // Get sync info
        const syncInfo = await getSyncInfo(db, chatId);
        const afterTime = syncInfo?.last_synced_at || 0;
        // console.log("Local DB Sync Info: ", syncInfo);
        // First, try to load messages from local database
        const localMessages = await getMessagesForUsers(db, user.id, recipient.id) || [];
        const serverResponse = await fetchAllMessages(user?.id, recipient?.id, encodeURIComponent(afterTime), token);
        const serverChats = serverResponse?.chats || [];
        
        // console.log('Local messages count:', localMessages.length);
        // console.log('Server messages count:', serverChats.length);
        
        if (serverChats.length === 0 && localMessages.length === 0) {
          // console.log('No messages found in either local or server data');
          setAllMessages([]);
          setIsLoading(false);
          return;
        }

        if (serverChats.length > 0) {
          await processAndStoreServerMessages(serverChats, localMessages);
          return;
        }
        else if (localMessages.length > 0) {
          const formatted = localMessages.map((msg) => ({
              message: msg.message,
              recipaent: {
                email: msg.from_id === user.id ? recipient.email : user.email
              },
            }));
          setIsLoading(false);
          setAllMessages(formatted);
          return;
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      }
    }
    fetchMessages();
  }, [recipient, user, token, db]);

  const processAndStoreServerMessages = async (serverChats, localChats) => {
    try {
      setIsLoading(true);
      setMsgLength(serverChats.length);
      
      const localMessages = localChats.map((msg) => ({
        message: msg.message,
        recipaent: {
          email: msg.from_id === user.id ? recipient.email : user.email
        },
      }));
      
      setAllMessages(localMessages);
      setIsLoading(false);
      setIsDecoding(true);
      const messages = serverChats.map((msg) => {
        const isFromCurrentUser = msg.from_id === user.id;
        return {
          message: decryptMessage(msg.message, isFromCurrentUser),
          recipaent: { email: isFromCurrentUser ? recipient.email : user.email },
          timestamp: msg.message_time,
          id: msg.id
        };
      });

      setAllMessages((prev)=> [...prev, ...messages]);

      // Store fetched messages in local database using batch insert
      const messagesToStore = messages.map((msg) => ({
        id: msg.id,
        from_id: msg.recipaent.email === recipient.email ? user.id : recipient.id,
        to_id: msg.recipaent.email === recipient.email ? recipient.id : user.id,
        message: msg.message,
        message_time: msg.timestamp
      }));

      await batchInsertMessages(db, messagesToStore);
      // Store server's original timestamp format to maintain consistency
      const lastServerTime = serverChats[serverChats.length - 1].message_time;
      
      // console.log("Last Server Time: ", lastServerTime);
      await updateSyncInfo(db, `${user.id}_${recipient.id}`, lastServerTime);
      setIsDecoding(false);
      // console.log(`Loaded ${messages.length} messages from server`);
    } catch (error) {
      console.error('Error processing server messages:', error);
      setIsDecoding(false);
      setIsLoading(false);
      // Re-throw to be caught by the parent try-catch
      throw error;
    }
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (flatListRef.current && allmessages.length) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [allmessages]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket || !db || !recipient) return;

    const handleReceiveMessage = async ({message, to, from, chatTime}) => {
      try {
        console.log("Received message:",  message);
        if (!recipient || String(from) !== String(recipient?.id)) return;

        const decryptedMessage = decryptMessage(message, false);
        if (decryptedMessage) {
          // Add to UI
          // console.log("Decrypted message:", decryptedMessage);
          setAllMessages((prev) => [
            ...prev,
            { message: decryptedMessage, recipaent: to },
          ]);
          // console.log(msg);
          // Store decrypted message in local database with timestamp
          const timestamp = chatTime || new Date().toISOString();
          await insertRealtimeMessage(db, recipient?.id, user?.id, decryptedMessage, timestamp);
          await updateSyncInfo(db, `${user.id}_${recipient.id}`, timestamp);
        }
      } catch (error) {
        console.error("Error handling received message:", error);
      }
    };

    const handleSentMessage = async ({chatTime}) => {
      try {
          // console.log("Sent message:",  chatTime);
          const timestamp = chatTime || new Date().toISOString();
          await updateSyncInfo(db, `${user.id}_${recipient.id}`, timestamp);

      } catch (error) {
        console.error("Error handling sent message:", error);
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-sent", handleSentMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-sent", handleSentMessage);
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
              <Text style={styles.status}>{isOnline ? "Online" : "Offline"}</Text>
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
            {isLoading ? <ActivityIndicator size="large" color="#7FFFAB" /> : <AntDesign name="cloud-download" size={50} color="#7FFFAB" />}
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