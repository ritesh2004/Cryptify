import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAppSelector } from '../redux/hooks';
import { updateSocketID } from '../apis/updateSocketID';

const useSocketConnection = (userId) => {
    //states
    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState(null);
    const [socketId, setSocketId] = useState(null);

    // Selectors
    const token = useAppSelector(state => state.token);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io("http://192.168.1.4:5000", {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []); // Empty dependency array as we only want to initialize once

    // Handle socket events
    useEffect(() => {
        if (!socket) return;

        const handleConnect = async () => {
            console.log("Connected to socket server");
            setSocketId(socket.id);
            await updateSocketID(socket.id, token);
        };

        const handleStatus = (data) => {
            setStatus(data);
        };

        const handleDisconnect = () => {
            console.log("Disconnected from socket server");
            setSocketId(null);
        };

        // Set up event listeners
        socket.on("connect", handleConnect);
        socket.on("status", handleStatus);
        socket.on("disconnect", handleDisconnect);

        // Cleanup listeners
        return () => {
            socket.off("connect", handleConnect);
            socket.off("status", handleStatus);
            socket.off("disconnect", handleDisconnect);
        };
    }, [socket]);

    // Emit status when user changes
    useEffect(() => {
        if (!socket || !userId) return;

        socket.emit("status", userId);
    }, [socket, userId]);

    return {
        socket,
        status,
        socketId,
        isConnected: !!socket?.connected
    };
};

export { useSocketConnection };