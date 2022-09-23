import React from "react";
import { createContext, FunctionComponent, ReactNode, useState } from "react";
import { useContextFallback } from "./charactersContext";

type MapSettingsContextType = {
  grid: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  markers: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  usernames: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

const MapSettingsContext = createContext<MapSettingsContextType | undefined>(
  undefined
);

export const MapSettingsProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const showGridState = useState(false);
  const showMarkersState = useState(true);
  const showUsernames = useState(true);

  const value: MapSettingsContextType = {
    grid: showGridState,
    markers: showMarkersState,
    usernames: showUsernames,
  };

  return (
    <MapSettingsContext.Provider value={value}>
      {children}
    </MapSettingsContext.Provider>
  );
};

export const useGridToggle = () => useContextFallback(MapSettingsContext).grid;
export const useUsernameToggle = () =>
  useContextFallback(MapSettingsContext).usernames;
export const useMarkersToggle = () =>
  useContextFallback(MapSettingsContext).markers;
