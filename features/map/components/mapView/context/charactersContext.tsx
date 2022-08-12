import { Character, Map } from "graphql/client/graphql";
import {
  Context,
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
} from "react";
import { useCharacters } from "../hooks/useCharacters";

const CharactersContext = createContext<Character[] | undefined>(undefined);

export const CharactersProvider: FunctionComponent<{
  children?: ReactNode;
  ids: number[];
}> = ({ children, ids }) => {
  const characters = useCharacters(ids);

  return (
    <CharactersContext.Provider value={characters}>
      {children}
    </CharactersContext.Provider>
  );
};

export const useCharacter = (mapId: number) =>
  useContextFallback(CharactersContext).filter(
    (character) => character.inMap === mapId
  );

export const useContextFallback = <T,>(value: Context<T | undefined>): T => {
  const ctx = useContext<T | undefined>(value);
  if (!ctx) {
    throw new Error(`This Component require context: ${value.displayName}`);
  }
  return ctx;
};
