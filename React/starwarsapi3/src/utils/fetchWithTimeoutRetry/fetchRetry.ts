import { FetchError, FetchProps } from "../../types/fetchData";

export const fetchRetry = ({
  controller,
  url,
  retryCount,
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
      if (retryCount === 1) {
        return Promise.reject(error);
      }
      return fetchRetry({
        url: url,
        retryCount: retryCount - 1,
        controller: controller,
      });
    });
};
