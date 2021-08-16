import { TIMEOUT_LIMIT } from "../constants/useQuery";

import { FetchError, FetchProps } from "../types/fetchData";
import { fetchRetry } from "./fetchRetry";

export const fetchWithTimeoutRetry = ({
  url,
  n,
  controller,
  ...args
}: FetchProps): Promise<Response | FetchError> => {
  return new Promise((resolve, reject) => {
    let myTimeout = setTimeout(() => {
      controller.abort();
      reject(Error("Error Code : 408. Exceeded Timeout Limit!"));
    }, TIMEOUT_LIMIT);

    fetchRetry({ controller: controller, url: url, n: n, ...args })
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
