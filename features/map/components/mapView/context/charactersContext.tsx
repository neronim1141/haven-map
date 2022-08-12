import { Character, useCharactersSubscription } from "graphql/client/graphql";
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
  const [characters, setCharacters] = useState<Character[]>([]);
  useCharactersSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      const data = subscriptionData.data?.characters;
      if (!data) return;
      setCharacters((prev) => {
        const filtered = prev.filter(
          (character) => !data.find((char) => char.id == character.id)
        );

        return [...filtered, ...data];
      });
    },
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setCharacters((prev) => {
        return prev.filter((character) => character.expire > Date.now());
      });
    }, 2500);
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
