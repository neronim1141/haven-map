import { Role } from "@prisma/client";
import { Character, useCharactersSubscription } from "graphql/client/graphql";
import { useSession } from "next-auth/react";
import React, {
  Context,
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { trpc } from "utils/trpc";
import { canAccess } from "~/server/routers/user/utils";

const CharactersContext = createContext<Character[] | undefined>(undefined);

export const CharactersProvider: FunctionComponent<{
  children?: ReactNode;
}> = ({ children }) => {
  const session = useSession();
  const [characters, setCharacters] = useState<Character[]>([]);

  trpc.useSubscription(["character.all"], {
    onNext(characters) {
      console.log(characters);
      if (!characters) return;

      setCharacters((prev) => {
        const updated = prev.map((character) => {
          const found = characters.find((char) => char.id === character.id);
          if (found)
            return {
              ...found,
              name: character.name,
            };
          else return character;
        });
        const filtered = characters.filter(
          (character) => !updated.find((char) => char.id === character.id)
        );
        return [...updated, ...filtered];
      });
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCharacters((prev) => {
        return prev.filter((character) => character.expire > Date.now());
      });
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <CharactersContext.Provider value={characters}>
      {children}
    </CharactersContext.Provider>
  );
};

export const useCharactersFor = (mapId: number) =>
  useContextFallback(CharactersContext).filter(
    (character) => character.inMap === mapId
  );
export const useCharacters = () => useContextFallback(CharactersContext);
export const useContextFallback = <T,>(value: Context<T | undefined>): T => {
  const ctx = useContext<T | undefined>(value);
  if (!ctx) {
    throw new Error(`This Component require context: ${value.displayName}`);
  }
  return ctx;
};
