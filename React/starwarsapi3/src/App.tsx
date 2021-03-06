import React, { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { DebounceInputHookType } from "./hooks/useDebounceInputHandling";
import { useDebounceInputHandling } from "./hooks/useDebounceInputHandling";

import { WaitingState } from "./components/WaitingState";
import { EmptyState } from "./components/EmptyState";
import { Film } from "./components/Film";
import { CacheContext } from "./types/cacheContext";

import { checkStringIsNumber } from "./utils/checkStringIsNumber";
import { FilmErrorBoundaryFallbackComponent } from "./components/FilmFallbackComponent";

const DataContext = React.createContext({});

export const DataProvider = ({ ...props }) => {
  const cache = React.useRef({});
  return <DataContext.Provider value={cache} {...props} />;
};

export const useDataContext = (): CacheContext => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataProvider!!");
  }
  return context;
};

const App = () => {
  const stateManager: DebounceInputHookType<string> = useDebounceInputHandling(
    "" as string
  );
  const filmId = stateManager.id;
  const isTyping = stateManager.isTyping;
  const handleValueChange = stateManager.handleValueChange;
  const [inputControl, setInputControl] = useState<string>("");

  const preventEnterKeyReload = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }, []);

  const handleChange = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      let currInput: string = e.currentTarget.value;
      if (checkStringIsNumber(currInput)) {
        setInputControl(() => currInput);
        handleValueChange(currInput);
      }
    },
    [handleValueChange]
  );

  return (
    <div className='app'>
      <form className='app-form' onKeyPress={preventEnterKeyReload}>
        <input
          className='app-input'
          placeholder='Please input film id (Number : 1 to 6)'
          value={inputControl}
          onChange={handleChange}
        />
      </form>
      <ErrorBoundary
        FallbackComponent={FilmErrorBoundaryFallbackComponent}
        resetKeys={[filmId]}
      >
        <DataProvider>
          {isTyping ? (
            <WaitingState />
          ) : filmId ? (
            <Film filmId={filmId} />
          ) : (
            <EmptyState />
          )}
        </DataProvider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
