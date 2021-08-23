import React from "react";
import { DEBOUNCE_TIME_LIMIT } from "../constants/useDebounceInputHandling";
import { debounce } from "../utils/debounce";

export interface DebounceInputHookType<IdType> {
  id: IdType;
  isTyping: boolean;
  handleValueChange: (arg: IdType) => any;
}

export const useDebounceInputHandling = <InputType extends string | number>(
  initialId: InputType
): DebounceInputHookType<InputType> => {
  const [input, setinput] = React.useState<InputType>(initialId);
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const handleInput = React.useCallback((waitingValue: InputType) => {
    setinput(() => waitingValue);
    setIsTyping(() => false);
  }, []);
  const handleInputDebounce = React.useCallback(
    debounce(handleInput, DEBOUNCE_TIME_LIMIT),
    []
  );

  const handleValueChange = React.useCallback(
    (inputValue: InputType) => {
      if (!inputValue) {
        handleInput(inputValue);
        handleInputDebounce(inputValue);
        return;
      }
      setIsTyping(true);
      handleInputDebounce(inputValue);
    },
    [handleInput, handleInputDebounce]
  );

  return {
    id: input,
    isTyping: isTyping,
    handleValueChange: handleValueChange,
  };
};
