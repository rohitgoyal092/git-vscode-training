import React from "react";

interface statusType {
  __this_is_status_type: "status_type";
}
function makeStatusType(value: string): statusType {
  return value as unknown as statusType;
}

interface Error {
  type: string;
  message: string;
}

const IDLE: statusType = makeStatusType("idle");
const FETCHING: statusType = makeStatusType("fetching");
const ERROR: statusType = makeStatusType("error");
const URL_ERROR: string = "url error";
const DATA_ERROR: string = "data error";
const NETWORK_ERROR: string = "network error";
const RETRY_COUNT: number = 10;
const TIMEOUT_LIMIT: number = 10000;
const DEBOUNCE_TIME_LIMIT: number = 500;
const BASE_FILM_URL: string = "https://swapi.dev/api/films/";

interface fetchProps {
  url: string;
  n: number;
  controller: AbortController;
}

const fetch_retry = ({
  controller,
  url,
  n,
  ...args
}: fetchProps): Promise<Response | Error> => {
  const signal: AbortSignal = controller.signal;
  return fetch(url, { signal }).catch(function (error) {
    if (signal.aborted) {
      return Promise.reject(error);
    }
    if (n === 1) {
      return Promise.reject(error);
    }
    return fetch_retry({ url: url, n: n - 1, controller: controller, ...args });
  });
};

const fetch_timeout = ({
  url,
  n,
  controller,
  ...args
}: fetchProps): Promise<Response | Error> => {
  return new Promise((resolve, reject) => {
    let myTimeout = setTimeout(() => {
      controller.abort();
      reject(Error("Error Code : 408. Exceeded Timeout Limit!"));
    }, TIMEOUT_LIMIT);

    fetch_retry({ controller: controller, url: url, n: n, ...args })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        clearTimeout(myTimeout);
      });
  });
};

interface useQueryStateType<DataType> {
  data: DataType | null;
  error: Error | null;
  status: statusType;
}

interface useQueryReturnType<DataType> {
  data: DataType | null;
  loading: boolean;
  error: Error | null;
}

const useQuery = <DataType,>({
  url,
  ...props
}: {
  url: string;
}): useQueryReturnType<DataType> => {
  const initialState: useQueryStateType<DataType> = {
    data: null,
    error: null,
    status: IDLE,
  };

  const [state, setState] = React.useState<useQueryStateType<DataType>>({
    ...initialState,
  });

  React.useLayoutEffect(() => {
    const controller: AbortController = new AbortController();
    let isRunning: boolean = true;
    let errorEncountered: boolean = false;
    if (url) {
      setState((prevState: useQueryStateType<DataType>) => ({
        ...initialState,
        status: FETCHING,
      }));
      fetch_timeout({ url: url, n: RETRY_COUNT, controller: controller })
        .then(
          (response) => {
            if (!isRunning) {
              return;
            }
            if (!(response as Response).ok) {
              errorEncountered = true;
              setState(
                (
                  prevState: useQueryStateType<DataType>
                ): useQueryStateType<DataType> => ({
                  ...prevState,
                  status: ERROR,
                  error: {
                    type: URL_ERROR,
                    message: `Error hitting the url : "${url}". ErrorCode ${
                      (response as Response).status
                    }`,
                  },
                })
              );
              return Promise.resolve();
            }
            return (response as Response).json();
          },
          (error: Error) => {
            if (!isRunning) {
              return;
            }
            errorEncountered = true;
            setState(
              (
                prevState: useQueryStateType<DataType>
              ): useQueryStateType<DataType> => ({
                ...prevState,
                status: ERROR,
                error: {
                  type: NETWORK_ERROR,
                  message: `Network Error : ${error.message}`,
                },
              })
            );
          }
        )
        .then((response: DataType) => {
          if (isRunning) {
            if (!errorEncountered) {
              setState(
                (prevState): useQueryStateType<DataType> => ({
                  ...prevState,
                  data: response,
                  status: IDLE,
                })
              );
            }
          }
        })
        .catch((error: Error) => {
          if (isRunning) {
            setState(
              (
                prevState: useQueryStateType<DataType>
              ): useQueryStateType<DataType> => ({
                ...prevState,
                status: ERROR,
                error: {
                  type: DATA_ERROR,
                  message: `Parsing Error : Could not understand what was returned : ${error.message}`,
                },
              })
            );
          }
        });
    }
    return (): void => {
      isRunning = false;
      controller.abort();
    };
  }, [url]);
  return {
    data: state.data,
    loading: state.status === FETCHING,
    error: state.status === ERROR ? state.error : null,
  };
};

const Character = ({ url, ...props }: { url: string }) => {
  const { data, loading, error } = useQuery<{ name: string }>({ url: url });
  if (error) {
    return <div className={`character no-border`}>{error.message}</div>;
  }
  if (loading) {
    return <div className={`character no-border`}>{`Retrieving...`}</div>;
  }
  if (!data) {
    return <div className={`character no-border`}>{""}</div>;
  }
  return <div className={`character`}>{data.name}</div>;
};

const Film = ({ filmId, ...props }: { filmId: number }) => {
  const { data, loading, error } = useQuery<{ characters: [string] }>({
    url: `${BASE_FILM_URL}${filmId}`,
  });
  if (error) {
    return <div className={`film no-border`}>{error.message}</div>;
  }
  if (loading) {
    return <div className={`film no-border`}>{`Retrieving...`}</div>;
  }
  if (!data) {
    return <div className={`film no-border`}>{"hihi"}</div>;
  }
  return (
    <ul className={`film`}>
      {data["characters"].map((characterUrl) => {
        return <Character key={`${characterUrl}`} url={characterUrl} />;
      })}
    </ul>
  );
};

const EmptyState = () => {
  return <div className={`film no-border`}>{""}</div>;
};

const WaitingState = () => {
  return <div className={`film no-border`}>{"Receiving Input...."}</div>;
};

const debounce = (func: Function, timeout = DEBOUNCE_TIME_LIMIT) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args as []);
    }, timeout);
  };
};

interface debounceInputHookType<IdType> {
  inputRef: React.RefObject<HTMLInputElement>;
  id: IdType;
  isTyping: boolean;
  handleKeyUp: (e: React.KeyboardEvent) => any;
}

const useDebounceInputHanlding = <InputType extends string | number>(
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
    <div className='ContainingClass'>
      <form className='FormClass' onKeyPress={preventEnterKeyReload}>
        <input
          className='InputBoxClass'
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

// ReactDOM.render(<App />, document.getElementById("root"));

export default App;
