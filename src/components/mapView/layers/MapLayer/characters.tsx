import React from "react";
import { CharacterMarker } from "../../characterMarker";
import { useCharactersFor } from "../../context/charactersContext";

interface CharactersProps {
  opacity: number;
  mapId: number;
}
const Characters = ({ opacity, mapId }: CharactersProps) => {
  const characters = useCharactersFor(mapId);

  return (
    <>
      {characters?.map((character) => (
        <CharacterMarker
          key={character.id}
          character={character}
          opacity={opacity}
        />
      ))}
    </>
  );
};

export default Characters;
