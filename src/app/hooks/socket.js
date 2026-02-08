// hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
  const socketCreated = useRef(false);
  useEffect(() => {
    if (!socketCreated.current) {
      const socketInitializer = async () => {
        await io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
      };
      try {
        socketInitializer();
        socketCreated.current = true;
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
};

export default useSocket;
