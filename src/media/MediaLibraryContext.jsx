import React, { createContext, useContext } from 'react';

export const MediaLibraryContext = createContext(null);

export function MediaLibraryProvider({ media, children }) {
  return (
    <MediaLibraryContext.Provider value={media}>
      {children}
    </MediaLibraryContext.Provider>
  );
}

export function useMediaLibrary() {
  return useContext(MediaLibraryContext);
}
