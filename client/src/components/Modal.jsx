import React from "react";
import Select from "react-select";

import {
  MODAL_ACTION_TYPES,
  MODAL_STATES,
  useModalManager,
} from "../hooks/useModalManager";

const options = [
  { value: "CAT", label: "Cat" },
  { value: "DOG", label: "Dog" },
];

export const Modal = () => {
  const [state, dispatch] = useModalManager();
  const {
    pet: { id, name, type },
    onSubmit,
  } = state;

  const [tempName, setTempName] = React.useState(name || "");
  const [tempType, setTempType] = React.useState(type || "DOG");
  const submit = (event) => {
    event.preventDefault();
    onSubmit({ id, name: tempName, type: tempType });
  };

  const cancel = (event) => {
    event.preventDefault();
    dispatch({ type: MODAL_ACTION_TYPES.SET_CLOSE });
  };

  const activeOption = options.find((o) => o.value === tempType);

  return (
    <div>
      <div className="row center-xs">
        <div className="col-xs-8">
          <div className="new-pet page">
            <h1>{state.mode === MODAL_STATES.ADD ? "Add Pet" : "Edit Pet"}</h1>
            <div className="box">
              <form onSubmit={submit}>
                <Select
                  value={activeOption}
                  defaultValue={options[0]}
                  onChange={(e) => setTempType(e.value)}
                  options={options}
                />

                <input
                  className="input"
                  type="text"
                  placeholder="pet name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  required
                />
                <a className="error button" onClick={cancel}>
                  cancel
                </a>
                <button type="submit" name="submit">
                  {state.mode === MODAL_STATES.ADD ? "Add pet" : "Edit pet"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
