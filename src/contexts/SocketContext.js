import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAppSelector } from '../redux/hooks';

export const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const token = useAppSelector(state => state.login?.token);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [hasUnseen, setHasUnseen] = useState({});
  
  const updateOnlineUsers = (users) => {
    if (Array.isArray(users)) {
      setOnlineUsers(users);
    } else if (typeof users === 'function') {
      setOnlineUsers(prev => {
        const updated = users(prev);
        return Array.isArray(updated) ? updated : prev;
      });
    }
  };

  const updateHasUnseen = (newUnseen) => {
    setHasUnseen(prev => ({ ...prev, ...newUnseen }));
  };

  const markAsSeen = (userId) => {
    setHasUnseen(prev => ({
      ...prev,
      [userId]: false
    }));
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(String(userId));
  };

  const getSocket = () => {
    if (!process.env.EXPO_PUBLIC_SOCKET_URL) {
      console.error('EXPO_PUBLIC_SOCKET_URL is not defined');
      return null;
    }

    if (!socketRef.current) {
      console.log('Creating new socket instance');
      socketRef.current = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
        autoConnect: false,
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Add global error handlers
      socketRef.current.on('connect_error', (err) => {
        console.error('Global socket connect_error:', err.message);
      });

      socketRef.current.on('error', (err) => {
        console.error('Global socket error:', err);
      });

      // Online users management
      socketRef.current.on('status', (data) => {
        if (Array.isArray(data)) {
          updateOnlineUsers(data.map(id => String(id)));
        }
      });

      socketRef.current.on('user-connected', ({ id }) => {
        updateOnlineUsers(prev => [...prev, String(id)]);
      });

      socketRef.current.on('user-disconnected', (userId) => {
        updateOnlineUsers(prev => prev.filter(id => id !== String(userId)));
      });
    }

    return socketRef.current;
  };

  // Handle token changes
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !token) return;

    // If we have a token and the socket isn't connected, try to connect
    if (token && !socket.connected) {
      console.log('Token available, attempting to connect socket...');
      socket.auth = { token };
      socket.connect();
    }

    return () => {
      // Don't disconnect here as we want to maintain the connection
      // The socket will be cleaned up when the provider unmounts
    };
  }, [token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{
      getSocket,
      socket: socketRef.current,
      onlineUsers,
      updateOnlineUsers,
      hasUnseen,
      updateHasUnseen,
      markAsSeen,
      isUserOnline
    }}>
      {children}
    </SocketContext.Provider>
  );
};
