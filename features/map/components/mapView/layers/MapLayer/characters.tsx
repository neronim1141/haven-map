import React from "react";
import { CharacterMarker } from "../../characterMarker";
import { useCharacter } from "../../context/charactersContext";

interface CharactersProps {
  opacity: number;
  mapId: number;
}
const Characters = ({ opacity, mapId }: CharactersProps) => {
  const characters = useCharacter(mapId);

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
