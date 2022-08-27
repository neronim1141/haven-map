/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { createRouter } from "../../createRouter";
import { Subscription } from "@trpc/server";
import { Character } from "graphql/server/types";
import { eventEmitter } from "../../eventEmitter";

export const characterRouter = createRouter().subscription("all", {
  resolve() {
    return new Subscription<Character[]>((emit) => {
      const onAdd = (data: Character[]) => emit.data(data);
      eventEmitter.on("characters", onAdd);
      return () => {
        eventEmitter.off("characters", onAdd);
      };
    });
  },
});
