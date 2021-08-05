import { debounceInputHookType } from "./hooks/useDebounceInputHanlding";
import { useDebounceInputHanlding } from "./hooks/useDebounceInputHanlding";
import { WaitingState } from "./components/WaitingState";
import { EmptyState } from "./components/EmptyState";
import { Film } from "./components/Film";

const App = () => {
  const stateManager: debounceInputHookType<number> =
    useDebounceInputHanlding(0);
  const inputRef = stateManager.inputRef;
  const filmId = stateManager.id;
  const isTyping = stateManager.isTyping;
  const handleKeyUp = stateManager.handleKeyUp;

  const preventEnterKeyReload = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  return (
    <div className='app'>
      <form className='app-form' onKeyPress={preventEnterKeyReload}>
        <input
          className='app-input'
          ref={inputRef}
          placeholder='Please input film id'
          type='number'
          onKeyUp={handleKeyUp}
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
