import { Character, useCharactersSubscription } from "graphql/client/graphql";
import { useEffect, useState } from "react";

type TrackedCharacter = Character;
export const useCharacters = (ids: number[]) => {
  const [characters, setCharacters] = useState<TrackedCharacter[]>([]);
  useCharactersSubscription({
    variables: { ids },
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

  return characters;
};
