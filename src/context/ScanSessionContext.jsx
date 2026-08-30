import { createContext, useContext, useState } from "react";

const ScanSessionContext = createContext(null);

export function ScanSessionProvider({ children }) {
  const [pages, setPages] = useState([]);

  const addPage = (page) => {
    setPages((currentPages) => [...currentPages, page]);
  };

  const deletePage = (pageId) => {
    setPages((currentPages) =>
      currentPages.filter((page) => page.id !== pageId),
    );
  };

  const replacePage = (pageId, newPage) => {
    setPages((currentPages) =>
      currentPages.map((page) => (page.id === pageId ? newPage : page)),
    );
  };

  const clearSession = () => {
    setPages([]);
  };

  return (
    <ScanSessionContext.Provider
      value={{
        pages,
        addPage,
        deletePage,
        replacePage,
        clearSession,
      }}
    >
      {children}
    </ScanSessionContext.Provider>
  );
}

export function useScanSession() {
  const context = useContext(ScanSessionContext);

  if (!context) {
    throw new Error("useScanSession must be used inside ScanSessionProvider");
  }

  return context;
}
