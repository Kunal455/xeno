import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to the backend server
    const socketUrl = 'http://localhost:5001';
    console.log(`[Socket] Connecting to ${socketUrl}...`);
    const newSocket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected to backend! ID:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected from backend.');
      setConnected(false);
    });

    newSocket.on('campaign_status', (data) => {
      console.log('[Socket] Received campaign_status event:', data);
      addNotification({ type: 'campaign', ...data });
    });

    newSocket.on('message_status', (data) => {
      console.log('[Socket] Received message_status event:', data);
      addNotification({ type: 'message', ...data });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const addNotification = (notif) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newNotif = { id, timestamp: new Date(), ...notif };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 50)); // Keep last 50
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ socket, connected, notifications, removeNotification, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
