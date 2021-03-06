import { ErrorBoundary } from "react-error-boundary";

import { useQuery } from "../hooks/useQuery";
import { BASE_FILM_URL } from "../constants/Film";
import { Character } from "./Character";
import { FilmMessageContent } from "./FilmMessageContent";
import { CharacterFallbackComponent } from "./CharacterFallbackComponent";

export const Film = ({ filmId }: { filmId: string }) => {
  const { data, loading, error } = useQuery<{ characters: [string] }>({
    url: `${BASE_FILM_URL}${filmId}`,
  });

  if (error) {
    throw new Error(error.message);
  }
  if (loading) {
    return <FilmMessageContent>{`Retrieving...`}</FilmMessageContent>;
  }
  if (!data) {
    return <FilmMessageContent>{""}</FilmMessageContent>;
  }
  return (
    <ul className={`film`}>
      {data["characters"].map((characterUrl) => {
        return (
          <li className='character' key={`${characterUrl}`}>
            <ErrorBoundary FallbackComponent={CharacterFallbackComponent}>
              <Character url={characterUrl} />
            </ErrorBoundary>
          </li>
        );
      })}
    </ul>
  );
};
