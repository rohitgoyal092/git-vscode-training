import React, { useState } from "react";

import { DebounceInputHookType } from "./hooks/useDebounceInputHanlding";
import { useDebounceInputHanlding } from "./hooks/useDebounceInputHanlding";

import { WaitingState } from "./components/WaitingState";
import { EmptyState } from "./components/EmptyState";
import { Film } from "./components/Film";

import { checkStringIsNumber } from "./appHelper/checkStringIsNumber";

const App = () => {
  const stateManager: DebounceInputHookType<string> = useDebounceInputHanlding(
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
      {isTyping ? (
        <WaitingState />
      ) : filmId ? (
        <Film filmId={filmId} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default App;
