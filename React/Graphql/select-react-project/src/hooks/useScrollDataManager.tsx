import { useQuery } from "@apollo/client";
import React from "react";
import { GET_MORE_CITIES } from "../graphql_queries/City";
import { GetCities } from "../types/City";
import {
  ScrollDataManagerError,
  ScrollDataManagerResult,
} from "../types/ScrollDataManagerResult";

export const useScrollDataManager = (
  initialLength: number
): ScrollDataManagerResult => {
  const [currentLength, setCurrentLength] =
    React.useState<number>(initialLength);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [fetchMoreError, setFetchMoreError] =
    React.useState<ScrollDataManagerError>(undefined);
  const { data, loading, error, fetchMore } = useQuery<GetCities>(
    GET_MORE_CITIES,
    {
      variables: { input: { offset: 0, limit: currentLength } },
    }
  );
  const customFetchMore = (length: number) => {
    if (data && !isFetching && !loading && !fetchMoreError && !error) {
      const lengthTillNow = data.getCities.length;
      setIsFetching(true);
      fetchMore({
        variables: { input: { offset: lengthTillNow, limit: length } },
      })
        .then((result) => {
          setCurrentLength(lengthTillNow + length);
          setIsFetching(false);
        })
        .catch((fetchMoreError1: Error) => {
          setFetchMoreError(fetchMoreError1);
          setIsFetching(false);
        });
    }
  };

  return {
    data: data?.getCities,
    isLoading: loading,
    isFetching: isFetching,
    fetchMore: customFetchMore,
    useQueryError: error,
    fetchMoreError: fetchMoreError,
  };
};
