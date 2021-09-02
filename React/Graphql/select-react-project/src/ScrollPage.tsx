import { FETCHED_PAGE_SIZE, INITIAL_PAGE_SIZE } from "./constants/ScrollPage";
import { useScrollDataManager } from "./hooks/useScrollDataManager";
import { City } from "./types/City";

export const ScrollPage = () => {
  const {
    isLoading,
    isFetching,
    fetchMore,
    data,
    useQueryError,
    fetchMoreError,
  } = useScrollDataManager(INITIAL_PAGE_SIZE);

  const error = useQueryError || fetchMoreError;
  const loading = isLoading || isFetching;

  return (
    <div className='scroll-page-outer'>
      <ul
        className='scroll-page'
        onScroll={(event) => {
          const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
          if (scrollTop + clientHeight >= 0.9 * scrollHeight) {
            fetchMore(FETCHED_PAGE_SIZE);
          }
        }}
      >
        {data?.map((city: City) => {
          return <li key={city.id}>{city.name}</li>;
        }) ?? null}
      </ul>
      {error ? `Error : ${error}!!` : loading ? `Loading..` : "Scroll down.."}
    </div>
  );
};
