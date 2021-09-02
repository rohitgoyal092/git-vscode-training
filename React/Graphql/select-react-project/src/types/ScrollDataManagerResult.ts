import { City } from "./City";

export type ScrollDataManagerData = City[] | undefined;
export type ScrollDataManagerError = Error | undefined;

export interface ScrollDataManagerResult {
  isLoading: boolean;
  isFetching: boolean;
  fetchMore: Function;
  data: ScrollDataManagerData;
  useQueryError: ScrollDataManagerError;
  fetchMoreError: ScrollDataManagerError;
}
