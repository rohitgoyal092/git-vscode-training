import React from "react";

import {
  NETWORK_STATUS,
  ERROR_TYPES,
  RETRY_COUNT,
  TIMEOUT_LIMIT,
} from "../constants/hooks/useQuery";
import { statusType } from "../constants/hooks/useQuery";

export interface Error {
  type: string;
  message: string;
}

export interface fetchProps {
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

export interface useQueryStateType<DataType> {
  data: DataType | null;
  error: Error | null;
  status: statusType;
}

export interface useQueryReturnType<DataType> {
  data: DataType | null;
  loading: boolean;
  error: Error | null;
}

export const useQuery = <DataType,>({
  url,
  ...props
}: {
  url: string;
}): useQueryReturnType<DataType> => {
  const initialState: useQueryStateType<DataType> = {
    data: null,
    error: null,
    status: NETWORK_STATUS.IDLE,
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
        status: NETWORK_STATUS.FETCHING,
      }));
      fetch_timeout({
        url: url,
        n: RETRY_COUNT,
        controller: controller,
      })
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
                  status: NETWORK_STATUS.ERROR,
                  error: {
                    type: ERROR_TYPES.URL_ERROR,
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
                status: NETWORK_STATUS.ERROR,
                error: {
                  type: ERROR_TYPES.NETWORK_ERROR,
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
                  status: NETWORK_STATUS.IDLE,
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
                status: NETWORK_STATUS.ERROR,
                error: {
                  type: ERROR_TYPES.DATA_ERROR,
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
    loading: state.status === NETWORK_STATUS.FETCHING,
    error: state.status === NETWORK_STATUS.ERROR ? state.error : null,
  };
};
