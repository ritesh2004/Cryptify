import { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '../redux/hooks';
import { updateSocketID } from '../apis/updateSocketID';
import { useSocket } from '../contexts/SocketContext';

const useSocketConnection = (userId, recipient) => {
    // States
    const [status, setStatus] = useState(null);
    const [socketId, setSocketId] = useState(null);
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [hasUnseen, setHasUnseen] = useState({});
    
    // Socket context
    const { updateOnlineUsers, updateHasUnseen } = useSocket();
    
    // Get socket instance from context
    const { getSocket } = useSocket();
    const socket = getSocket();
    
    // Selectors
    const token = useAppSelector(state => state.login.token);

    // Initialize socket connection
    useEffect(() => {
        if (!socket) {
            console.log("Socket not initialized yet");
            return;
        }

        console.log("Setting up socket connection...");
        console.log("Current socket state:", {
            connected: socket.connected,
            id: socket.id,
            auth: socket.auth,
            io: {
                uri: socket.io?.uri,
                opts: socket.io?.opts
            }
        });

        const onConnect = () => {
            console.log("Socket connected successfully! ID:", socket.id);
            if (socket.id) {
                console.log("Updating socket ID on server:", socket.id);
                updateSocketID(socket.id, token)
                    .then(() => console.log("Socket ID updated on server"))
                    .catch(err => console.error("Failed to update socket ID:", err));
                setSocketId(socket.id);
            }
        };

        const onUsers = (data) => setUsers(data?.users);
        
        const onStatus = (data) => {
            if (Array.isArray(data)) {
                updateOnlineUsers(data.map(id => String(id)));
            }
        };

        const onReceiveMessage = (payload) => {
            const fromId = String(payload.from);
            if (recipient && String(recipient.id) === fromId) return;
            updateHasUnseen({ [fromId]: true });
        };

        const onUserConnected = ({ id }) => {
            console.log("User connected:", id);
            updateOnlineUsers(prevUsers => [...new Set([...prevUsers, String(id)])]);
        };

        const onConnectError = (err) => {
            console.error("Socket connection error:", {
                message: err.message,
                description: err.description,
                context: err.context,
                type: err.type,
                stack: err.stack
            });
        };

        // Set up event listeners
        socket.on("connect", onConnect);
        socket.on("users", onUsers);
        socket.on("status", onStatus);
        socket.on("receive-message", onReceiveMessage);
        socket.on("user-connected", onUserConnected);
        socket.on("connect_error", onConnectError);
        socket.on("user-disconnected", (userId) => {
            updateOnlineUsers(prevUsers => prevUsers.filter(id => id !== String(userId)));
        });

        // Connect to socket
        console.log("Attempting to connect with token:", token ? "[TOKEN PRESENT]" : "[NO TOKEN]");
        
        try {
            socket.auth = { token };
            socket.connect();
            console.log("Socket connect() called, connection in progress...");
        } catch (error) {
            console.error("Error while connecting socket:", error);
        }
        

        return () => {
            socket.off("connect", onConnect);
            socket.off("users", onUsers);
            socket.off("status", onStatus);
            socket.off("receive-message", onReceiveMessage);
            socket.off("user-connected", onUserConnected);
            socket.off("connect_error", onConnectError);
            // Don't disconnect here to maintain the connection
        };
    }, [socket, token, recipient]);

    return {
        socket,
        status,
        socketId,
        isConnected: !!socket?.connected,
        users,
        onlineUsers,
        hasUnseen,
        setHasUnseen
    };
};

export { useSocketConnection };