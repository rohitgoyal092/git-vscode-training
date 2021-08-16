export interface FetchError {
  type: string;
  message: string;
}

export interface FetchProps {
  url: string;
  n: number;
  controller: AbortController;
}
