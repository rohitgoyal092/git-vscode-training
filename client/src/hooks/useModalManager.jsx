import React from "react";

export const MODAL_STATES = {
  ADD: "ADD",
  EDIT: "EDIT",
  CLOSED: "CLOSED",
};

export const MODAL_ACTION_TYPES = {
  SET_EDIT: "SET EDIT",
  SET_CLOSE: "SET CLOSE",
  SET_ADD: "SET ADD",
};

export const ModalContext = React.createContext();

const initialModalValue = {
  mode: MODAL_STATES.CLOSED,
  pet: { id: null, name: "", type: "DOG" },
  onSubmit: null,
};

const modalReducer = (state, action) => {
  if (action.type === MODAL_ACTION_TYPES.SET_CLOSE) {
    return {
      ...initialModalValue,
      mode: MODAL_STATES.CLOSED,
    };
  } else if (action.type === MODAL_ACTION_TYPES.SET_ADD) {
    return {
      ...initialModalValue,
      mode: MODAL_STATES.ADD,
      onSubmit: action.onSubmit,
    };
  } else if (action.type === MODAL_ACTION_TYPES.SET_EDIT) {
    return {
      ...initialModalValue,
      pet: action.pet,
      mode: MODAL_STATES.EDIT,
      onSubmit: action.onSubmit,
    };
  } else throw new Error("Unexpected action type encountered!");
};

export const ModalProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(modalReducer, initialModalValue);
  const value = React.useMemo(() => [state, dispatch], [state, dispatch]);
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModalManager = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("ModalContext must be used within a Provider!");
  }
  return context;
};
