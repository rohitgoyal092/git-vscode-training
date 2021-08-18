export interface FetchError {
  type: string;
  message: string;
}

export interface FetchProps {
  url: string;
  retryCount: number;
  controller: AbortController;
}
