import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import SocketIOClient, { Socket } from "socket.io-client";
import { ServerToClientEvents } from "~/pages/api/socketio";

const SocketContext = createContext<undefined | Socket<ServerToClientEvents>>(
  undefined
);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    // connect to socket server
    const socket: Socket<ServerToClientEvents> = SocketIOClient(
      process.env.NEXT_PUBLIC_PREFIX ?? "http://localhost:3000",
      {
        path: "/api/socketio",
      }
    );
    // log socket connection
    socket.on("connect", () => {
      setSocket(socket);
    });

    socket.on("disconnect", () => {
      setSocket(undefined);
    });

    // socket disconnet onUnmount if exists
    if (socket)
      return () => {
        socket.disconnect();
        setSocket(undefined);
      };
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
