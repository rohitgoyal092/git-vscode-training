import React, { Reducer } from "react";
import { useDataContext } from "../App";
import { CacheContext } from "../types/cacheContext";

import { NETWORK_STATUS, RETRY_COUNT } from "../constants/useQuery";

import { statusType } from "../constants/useQuery";
import { FetchError } from "../types/fetchData";
import { generateSuccessfulParseJsonAction } from "../utils/fetchWithTimeoutRetry/actionGenerators";

import { fetchWithTimeoutRetry } from "../utils/fetchWithTimeoutRetry/fetchWithTimeoutRetry";
import { useFetchWithTimeoutRetry } from "./useFetchWithTimeoutRetry";
import { useSafeDispatch } from "./useSafeDispatch";

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

export interface UseQueryActionType<DataType> {
  type: statusType;
  data?: DataType | null;
  error?: FetchError | null;
}

const asyncReducer = <DataType,>(
  prevState: UseQueryStateType<DataType>,
  action: UseQueryActionType<DataType>
): UseQueryStateType<DataType> => {
  if (action.type === NETWORK_STATUS.IDLE) {
    return {
      ...prevState,
      status: NETWORK_STATUS.IDLE,
      data: action.data || null,
      error: null,
    };
  } else if (action.type === NETWORK_STATUS.FETCHING) {
    return {
      ...prevState,
      status: NETWORK_STATUS.FETCHING,
      data: null,
      error: null,
    };
  } else if (action.type === NETWORK_STATUS.ERROR) {
    return {
      ...prevState,
      status: NETWORK_STATUS.ERROR,
      data: null,
      error: action.error || null,
    };
  } else {
    throw new Error("Unhandled action type!");
  }
};

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

  const [state, unsafeDispatch] = React.useReducer<
    Reducer<UseQueryStateType<DataType>, UseQueryActionType<DataType>>
  >(asyncReducer, {
    ...initialState,
  });
  const dispatchContext: CacheContext = useDataContext();

  const dispatch = useSafeDispatch(unsafeDispatch);
  const run = useFetchWithTimeoutRetry(url, dispatch);

  React.useLayoutEffect(() => {
    const controller: AbortController = new AbortController();
    if (url) {
      if (dispatchContext.current[url]) {
        dispatch(
          generateSuccessfulParseJsonAction(dispatchContext.current[url])
        );
      } else {
        run(
          fetchWithTimeoutRetry({
            url: url,
            retryCount: RETRY_COUNT,
            controller: controller,
          })
        );
      }
    }
    return (): void => {
      controller.abort();
    };
  }, [url, dispatch, dispatchContext, run]);
  return {
    data: state.data,
    loading: state.status === NETWORK_STATUS.FETCHING,
    error: state.status === NETWORK_STATUS.ERROR ? state.error : null,
  };
};
