import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { ServerToClientEvents } from "~/pages/api/socketio";

const SocketContext = createContext<undefined | Socket<ServerToClientEvents>>(
  undefined
);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socketio");
      const socket = io({
        path: "/api/socketio",
      });
      socket.on("connect", () => {
        setSocket(socket);
      });
      socket.on("disconnect", () => {
        setSocket(undefined);
      });
      if (socket)
        return () => {
          socket.disconnect();
          setSocket(undefined);
        };
    };
    socketInitializer();
    // connect to socket server

    // log socket connection

    // socket disconnet onUnmount if exists
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocketIO = <T extends keyof ServerToClientEvents>(
  key: T,
  callback: ServerToClientEvents[T]
) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    //@ts-ignore
    socket?.on(key, callback);

    return () => {
      socket?.off(key);
    };
  }, [key, socket, callback]);
};
