import { Character } from "graphql/server/types";
import { pubsub } from "lib/pubsub";
import { prisma } from "lib/prisma";
export type PositionUpdateRequest = {
  [id: string]: {
    name: string;
    gridID: string;
    type: string;
    coords: {
      x: number;
      y: number;
    };
  };
};

export const updatePosition = async (data: PositionUpdateRequest) => {
  const flatData: Character[] = [];
  for (let [id, { coords, gridID, ...characterData }] of Object.entries(data)) {
    const grid = await prisma?.grid.findUnique({
      where: { id: gridID },
    });
    if (grid)
      flatData.push({
        ...characterData,
        id,
        inMap: grid.mapId,
        x: coords.x + grid.x * 100,
        y: coords.y + grid.y * 100,
        expire: new Date(Date.now() + 10000).getTime(),
      });
  }
  pubsub.publish("characters", flatData);
};
