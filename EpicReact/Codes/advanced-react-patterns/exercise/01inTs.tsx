// Context Module Functions
// http://localhost:3000/isolated/exercise/01.js

import * as React from "../../../advanced-react-patterns/node_modules/@types/react";
import { dequal } from "../../../advanced-react-patterns/node_modules/dequal";

// ./context/user-context.js

import * as userClient from "../../../advanced-react-patterns/src/user-client";
import { useAuth } from "../../../advanced-react-patterns/src/auth-context";

interface Actions {
  "start update": {
    updates: any;
  };
  "finish update": {
    updatedUser: any;
  };
  "fail update": {
    error: Error;
  };
  reset: {};
}

interface Statuses {
  pending: any;
  resolved: any;
  rejected: any;
}

interface StateType {
  status: keyof Statuses;
  error: Error | null;
  storedUser: any;
  user: any;
}

type ActionType<T extends keyof Actions> = { type: T } & Actions[T];
type ActionType1 =
  | ActionType<"start update">
  | ActionType<"finish update">
  | ActionType<"fail update">
  | ActionType<"reset">;

type ContextType = undefined | [StateType, React.Dispatch<ActionType1>];

const UserContext = React.createContext<ContextType>(undefined);
UserContext.displayName = "UserContext";

function userReducer(state: StateType, action: ActionType1): StateType {
  switch (action.type) {
    case "start update": {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.updates,
        },
        status: "pending",
        storedUser: state.user,
      };
    }
    case "finish update": {
      return {
        ...state,
        user: action.updatedUser,
        status: "resolved",
        storedUser: null,
        error: null,
      };
    }
    case "fail update": {
      return {
        ...state,
        status: "rejected",
        error: action.error,
        user: state.storedUser,
        storedUser: null,
      };
    }
    case "reset": {
      return {
        ...state,
        status: null,
        error: null,
      };
    }
    default: {
      throw new Error(`Unhandled action type!`);
    }
  }
}

function UserProvider({ children }): JSX.Element {
  const { user } = useAuth();
  const [state, dispatch] = React.useReducer<
    React.Reducer<StateType, ActionType1>
  >(userReducer, {
    status: null,
    error: null,
    storedUser: user,
    user,
  });
  const value: [StateType, React.Dispatch<any>] = [state, dispatch];
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser(): [StateType, React.Dispatch<ActionType1>] {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`);
  }
  return context;
}

const updateUser = (
  dispatch: React.Dispatch<ActionType1>,
  user: any,
  updates: any
) => {
  dispatch({ type: "start update", updates });
  return userClient.updateUser(user, updates).then(
    (updatedUser) => dispatch({ type: "finish update", updatedUser }),
    (error) => dispatch({ type: "fail update", error })
  );
};

// 🐨 add a function here called `updateUser`
// Then go down to the `handleSubmit` from `UserSettings` and put that logic in
// this function. It should accept: dispatch, user, and updates

// export {UserProvider, useUser}

// src/screens/user-profile.js
// import {UserProvider, useUser} from './context/user-context'
function UserSettings(): JSX.Element {
  const [{ user, status, error }, userDispatch] = useUser();

  const isPending: boolean = status === "pending";
  const isRejected: boolean = status === "rejected";

  const [formState, setFormState] = React.useState(user);

  const isChanged: boolean = !dequal(user, formState);

  function handleChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    // 🐨 move the following logic to the `updateUser` function you create above
    // userDispatch({type: 'start update', updates: formState})
    // userClient.updateUser(user, formState).then(
    //   updatedUser => userDispatch({type: 'finish update', updatedUser}),
    //   error => userDispatch({type: 'fail update', error}),
    // )
    updateUser(userDispatch, user, formState).catch(() => {});
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block" }} htmlFor='username'>
          Username
        </label>
        <input
          id='username'
          name='username'
          disabled
          readOnly
          value={formState.username}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block" }} htmlFor='tagline'>
          Tagline
        </label>
        <input
          id='tagline'
          name='tagline'
          value={formState.tagline}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block" }} htmlFor='bio'>
          Biography
        </label>
        <textarea
          id='bio'
          name='bio'
          value={formState.bio}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <button
          type='button'
          onClick={() => {
            setFormState(user);
            userDispatch({ type: "reset" });
          }}
          disabled={!isChanged || isPending}
        >
          Reset
        </button>
        <button
          type='submit'
          disabled={(!isChanged && !isRejected) || isPending}
        >
          {isPending
            ? "..."
            : isRejected
            ? "✖ Try again"
            : isChanged
            ? "Submit"
            : "✔"}
        </button>
        {isRejected ? (
          <pre style={{ color: "red" }}>{error.message}</pre>
        ) : null}
      </div>
    </form>
  );
}

function UserDataDisplay(): JSX.Element {
  const [{ user }] = useUser();
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}

function App(): JSX.Element {
  return (
    <div
      style={{
        minHeight: 350,
        width: 300,
        backgroundColor: "#ddd",
        borderRadius: 4,
        padding: 10,
      }}
    >
      <UserProvider>
        <UserSettings />
        <UserDataDisplay />
      </UserProvider>
    </div>
  );
}

// export default App
