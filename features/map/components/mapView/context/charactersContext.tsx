import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
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

const CharactersContext = createContext<Character[] | undefined>(undefined);

export const CharactersProvider: FunctionComponent<{
  children?: ReactNode;
}> = ({ children }) => {
  const session = useSession();
  const [characters, setCharacters] = useState<Character[]>([]);
  useCharactersSubscription({
    skip: !canAccess(Role.VILLAGER, session.data?.user.role),
    onSubscriptionData: ({ subscriptionData }) => {
      const data = subscriptionData.data?.characters;
      if (!data) return;

      setCharacters((prev) => {
        const updated = prev.map((character) => {
          const found = data.find((char) => char.id === character.id);
          return {
            ...character,
            expire: found ? found.expire : character.expire,
          };
        });
        const filtered = data.filter(
          (character) => !updated.find((char) => char.id === character.id)
        );
        console.log([...updated, ...filtered]);
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
