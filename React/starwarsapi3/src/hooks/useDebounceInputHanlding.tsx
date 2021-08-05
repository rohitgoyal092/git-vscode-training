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

export interface debounceInputHookType<IdType> {
  inputRef: React.RefObject<HTMLInputElement>;
  id: IdType;
  isTyping: boolean;
  handleKeyUp: (e: React.KeyboardEvent) => any;
}

export const useDebounceInputHanlding = <InputType extends string | number>(
  initialId: InputType
): debounceInputHookType<InputType> => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [input, setinput] = React.useState<InputType>(initialId);
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const handleInput = React.useState(() => {
    return (e: React.KeyboardEvent) => {
      if (inputRef.current !== null) {
        const input = inputRef.current.value;
        setinput(input as InputType);
        setIsTyping(false);
      }
    };
  })[0];
  const handleInputDebounce = React.useState(() => debounce(handleInput))[0];

  const handleKeyUp = React.useState(() => {
    return (e: React.KeyboardEvent) => {
      if (inputRef.current !== null) {
        const input = inputRef.current.value;
        if (!input) {
          handleInput(e);
          return;
        }
        setIsTyping(true);
        handleInputDebounce(e);
      }
    };
  })[0];

  return {
    inputRef: inputRef,
    id: input,
    isTyping: isTyping,
    handleKeyUp: handleKeyUp,
  };
};
