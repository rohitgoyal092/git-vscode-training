import React from "react";

import {
  NETWORK_STATUS,
  ERROR_TYPES,
  RETRY_COUNT,
} from "../constants/useQuery";

import { statusType } from "../constants/useQuery";
import { FetchError } from "../types/fetchData";
import { fetchWithTimeoutRetry } from "../utils/fetchWithTimeoutRetry";

export interface UseQueryStateType<DataType> {
  data: DataType | null;
  error: FetchError | null;
  status: statusType;
}

export interface UseQueryReturnType<DataType> {
  data: DataType | null;
  loading: boolean;
  error: FetchError | null;
}

export const useQuery = <DataType,>({
  url,
  ...props
}: {
  url: string;
}): UseQueryReturnType<DataType> => {
  const initialState: UseQueryStateType<DataType> = {
    data: null,
    error: null,
    status: NETWORK_STATUS.IDLE,
  };

  const [state, setState] = React.useState<UseQueryStateType<DataType>>({
    ...initialState,
  });

  React.useLayoutEffect(() => {
    const controller: AbortController = new AbortController();
    let isRunning: boolean = true;
    let errorEncountered: boolean = false;
    if (url) {
      setState((prevState: UseQueryStateType<DataType>) => ({
        ...initialState,
        status: NETWORK_STATUS.FETCHING,
      }));
      fetchWithTimeoutRetry({
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
                  prevState: UseQueryStateType<DataType>
                ): UseQueryStateType<DataType> => ({
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
          (error: FetchError) => {
            if (!isRunning) {
              return;
            }
            errorEncountered = true;
            setState(
              (
                prevState: UseQueryStateType<DataType>
              ): UseQueryStateType<DataType> => ({
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
                (prevState): UseQueryStateType<DataType> => ({
                  ...prevState,
                  data: response,
                  status: NETWORK_STATUS.IDLE,
                })
              );
            }
          }
        })
        .catch((error: FetchError) => {
          if (isRunning) {
            setState(
              (
                prevState: UseQueryStateType<DataType>
              ): UseQueryStateType<DataType> => ({
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
