import React from "react";
import { useDataContext } from "../App";
import { CacheContext } from "../types/cacheContext";
import { FetchError } from "../types/fetchData";
import {
  generateNetworkErrorAction,
  generateParsingErrorAction,
  generateSuccessfulParseJsonAction,
  generateUnsuccessfulResponseAction,
  generateFetchingAction,
} from "../utils/fetchWithTimeoutRetry/actionGenerators";

export const useFetchWithTimeoutRetry = <DataType,>(
  url: string,
  dispatch: Function
): ((promise: Promise<Response | FetchError>) => void) => {
  const dispatchContext: CacheContext = useDataContext();
  const run = React.useCallback(
    (promise: Promise<Response | FetchError>): void => {
      let errorEncountered: boolean = false;
      dispatch(generateFetchingAction());
      promise
        .then(
          (response) => {
            if (!(response as Response).ok) {
              errorEncountered = true;
              dispatch(
                generateUnsuccessfulResponseAction(response as Response, url)
              );

              return Promise.resolve();
            }
            return (response as Response).json();
          },
          (error: FetchError) => {
            errorEncountered = true;
            dispatch(generateNetworkErrorAction(error));
          }
        )
        .then((response: DataType) => {
          if (!errorEncountered) {
            dispatchContext.current[url] = response;
            dispatch(generateSuccessfulParseJsonAction(response));
          }
        })
        .catch((error: FetchError) => {
          dispatch(generateParsingErrorAction(error));
        });
    },
    [dispatch, url, dispatchContext]
  );
  return run;
};
