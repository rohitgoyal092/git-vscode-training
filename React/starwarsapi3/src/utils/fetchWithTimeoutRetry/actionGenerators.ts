import { UseQueryActionType } from "../../hooks/useQuery";
import { FetchError } from "../../types/fetchData";
import { NETWORK_STATUS } from "../../constants/useQuery";
import { ERROR_TYPES } from "../../constants/useQuery";

export const generateFetchingAction = <
  Datatype
>(): UseQueryActionType<Datatype> => {
  return {
    type: NETWORK_STATUS.FETCHING,
  };
};

export const generateUnsuccessfulResponseAction = <Datatype>(
  response: Response,
  url: string
): UseQueryActionType<Datatype> => {
  return {
    type: NETWORK_STATUS.ERROR,
    error: {
      type: ERROR_TYPES.URL_ERROR,
      message: `Error hitting the url : "${url}". ErrorCode ${
        (response as Response).status
      }`,
    },
  };
};

export const generateNetworkErrorAction = <Datatype>(
  error: FetchError
): UseQueryActionType<Datatype> => {
  return {
    type: NETWORK_STATUS.ERROR,
    error: {
      type: ERROR_TYPES.NETWORK_ERROR,
      message: `Network Error : ${error.message}`,
    },
  };
};

export const generateSuccessfulParseJsonAction = <Datatype>(
  response: Datatype
): UseQueryActionType<Datatype> => {
  return { type: NETWORK_STATUS.IDLE, data: response };
};

export const generateParsingErrorAction = <Datatype>(
  error: FetchError
): UseQueryActionType<Datatype> => {
  return {
    type: NETWORK_STATUS.ERROR,
    error: {
      type: ERROR_TYPES.DATA_ERROR,
      message: `Parsing Error : Could not understand what was returned : ${error.message}`,
    },
  };
};
