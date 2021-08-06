import { DebounceInputHookType } from "./hooks/useDebounceInputHanlding";
import { useDebounceInputHanlding } from "./hooks/useDebounceInputHanlding";
import { WaitingState } from "./components/WaitingState";
import { EmptyState } from "./components/EmptyState";
import { Film } from "./components/Film";
import React, { useState } from "react";

const checkStringIsNumber = (txt: string): boolean => {
  if (txt.length < 1) {
    return true;
  }
  let validRegex = /^[0-9]+$/;
  if (txt.match(validRegex)) {
    return true;
  }
  return false;
};

const preventEnterKeyReload = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};

const App = () => {
  const stateManager: DebounceInputHookType<number> = useDebounceInputHanlding(
    0 as number
  );
  const filmId = stateManager.id;
  const isTyping = stateManager.isTyping;
  const handleValueChange = stateManager.handleValueChange;
  const [inputControl, setInputControl] = useState<string>("");

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    let currInput: string = e.currentTarget.value;
    if (checkStringIsNumber(currInput)) {
      setInputControl(() => currInput);
      handleValueChange(parseInt(currInput, 10));
    } else {
      handleValueChange(parseInt(inputControl, 10));
    }
  };

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
