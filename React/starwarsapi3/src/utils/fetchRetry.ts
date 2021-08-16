import { FetchError, FetchProps } from "../types/fetchData";

export const fetchRetry = ({
  controller,
  url,
  n,
  ...args
}: FetchProps): Promise<Response | FetchError> => {
  const signal: AbortSignal = controller.signal;
  return fetch(url, { signal })
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch(function (error) {
      if (signal.aborted) {
        return Promise.reject(error);
      }
      if (n === 1) {
        return Promise.reject(error);
      }
      return fetchRetry({
        url: url,
        n: n - 1,
        controller: controller,
        ...args,
      });
    });
};
