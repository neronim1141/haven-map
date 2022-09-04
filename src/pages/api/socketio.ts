import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { Socket } from "net";
import { CharacterData } from "./client/[token]/positionUpdate";
import { logger } from "utils/logger";
export const config = {
  api: {
    bodyParser: false,
  },
};
export type ClientTile = {
  x: number;
  y: number;
  z: number;
  mapId: number;
  lastUpdated: string;
};
export interface ServerToClientEvents {
  characters: (character: CharacterData[]) => void;
  tileUpdate: (tile: ClientTile) => void;
  merge: (mapMerge: {
    from: number;
    to: number;
    shift: { x: number; y: number };
  }) => void;
}
export type SocketIO = ServerIO<{}, ServerToClientEvents>;
export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIO;
    };
  };
};

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    logger.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO<{}, ServerToClientEvents>(httpServer, {
      path: "/api/socketio",
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};
export default handler;
