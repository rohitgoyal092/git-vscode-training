const IDLE = "idle";
const FETCHING = "fetching";
const ERROR = "error";
const URL_ERROR = "url error";
const DATA_ERROR = "data error";
const NETWORK_ERROR = "network error";
const BASE_FILM_URL = "https://swapi.dev/api/films/";
const RETRY_COUNT = 3;
const TIMEOUT_LIMIT = 5000;
const DEBOUNCE_TIME_LIMIT = 500;

const fetch_retry = ({ controller, url, n, ...args }) => {
  const signal = controller.signal;
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

const fetch_timeout = ({ url, n, controller, ...args }) => {
  return new Promise((resolve, reject) => {
    const signal = controller.signal;
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

const useQuery = ({ url, ...props }) => {
  const initialState = {
    data: null,
    error: null,
    status: IDLE,
  };

  const [state, setState] = React.useState({ ...initialState });

  React.useLayoutEffect(() => {
    const controller = new AbortController();
    let isRunning = true;
    let errorEncountered = false;
    if (url) {
      setState((prevState) => ({ ...initialState, status: FETCHING }));
      fetch_timeout({ url: url, n: RETRY_COUNT, controller: controller })
        .then(
          (response) => {
            if (!isRunning) {
              return;
            }
            if (!response.ok) {
              errorEncountered = true;
              setState((prevState) => ({
                ...prevState,
                status: ERROR,
                error: {
                  type: URL_ERROR,
                  message: `Error hitting the url : "${url}". ErrorCode ${response.status}`,
                },
              }));
              return Promise.resolve();
            }
            return response.json();
          },
          (error) => {
            if (!isRunning) {
              return;
            }
            errorEncountered = true;
            setState((prevState) => ({
              ...prevState,
              status: ERROR,
              error: {
                type: NETWORK_ERROR,
                message: `Network Error : ${error.message}`,
              },
            }));
          }
        )
        .then((response) => {
          if (isRunning) {
            if (!errorEncountered) {
              setState((prevState) => ({
                ...prevState,
                data: response,
                status: IDLE,
              }));
            }
          }
        })
        .catch((error) => {
          if (isRunning) {
            setState((prevState) => ({
              ...prevState,
              status: ERROR,
              error: {
                type: DATA_ERROR,
                message: `Parsing Error : Could not understand what was returned : ${error.message}`,
              },
            }));
          }
        });
    }
    return () => {
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

const Character = ({ url, ...props }) => {
  const { data, loading, error } = useQuery({ url: url });
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

const Film = ({ filmId, ...props }) => {
  const { data, loading, error } = useQuery({
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
    <div className={`film`}>
      {data["characters"].map((characterUrl) => {
        return <Character key={`${characterUrl}`} url={characterUrl} />;
      })}
    </div>
  );
};

const EmptyState = () => {
  return <div className={`film no-border`}>{""}</div>;
};

const WaitingState = () => {
  return <div className={`film no-border`}>{"Receiving Input...."}</div>;
};

const debounce = (func, timeout = DEBOUNCE_TIME_LIMIT) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const useDebounceInputHanlding = () => {
  const inputRef = React.useRef();
  const [input, setinput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const handleInput = React.useState(() => {
    return (e) => {
      const input = inputRef.current.value;
      setinput(input);
      setIsTyping(false);
    };
  })[0];
  const handleInputDebounce = React.useState(() => debounce(handleInput))[0];

  const handleKeyUp = React.useState(() => {
    return (e) => {
      const input = inputRef.current.value;
      if (!input) {
        handleInput(e);
        return;
      }
      setIsTyping(true);
      handleInputDebounce(e);
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
  const stateManager = useDebounceInputHanlding();
  const inputRef = stateManager.inputRef;
  const filmId = stateManager.id;
  const isTyping = stateManager.isTyping;
  const handleKeyUp = stateManager.handleKeyUp;

  const preventEnterKeyReload = (e) => {
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

ReactDOM.render(<App />, document.getElementById("root"));
