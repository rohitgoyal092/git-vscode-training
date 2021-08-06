import React from "react";
import { DEBOUNCE_TIME_LIMIT } from "../constants/hooks/useDebounceInputHanlding";

const debounce = (func: Function, timeout = DEBOUNCE_TIME_LIMIT) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args as []);
    }, timeout);
  };
};

export interface DebounceInputHookType<IdType> {
  id: IdType;
  isTyping: boolean;
  handleValueChange: (arg: IdType) => any;
}

export const useDebounceInputHanlding = <InputType extends string | number>(
  initialId: InputType
): DebounceInputHookType<InputType> => {
  const [input, setinput] = React.useState<InputType>(initialId);
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const handleInput = React.useState(() => {
    return (waitingValue: InputType) => {
      setinput(() => waitingValue);
      setIsTyping(() => false);
    };
  })[0];
  const handleInputDebounce = React.useState(() => debounce(handleInput))[0];

  const handleValueChange = React.useState(() => {
    return (inputValue: InputType) => {
      if (!inputValue) {
        handleInput(inputValue);
        return;
      }
      setIsTyping(() => true);
      handleInputDebounce(inputValue);
    };
  })[0];

  return {
    id: input,
    isTyping: isTyping,
    handleValueChange: handleValueChange,
  };
};
