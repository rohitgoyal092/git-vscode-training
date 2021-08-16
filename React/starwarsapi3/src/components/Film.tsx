import { useQuery } from "../hooks/useQuery";
import { BASE_FILM_URL } from "../constants/Film";
import { Character } from "./Character";
import { FilmMessageContent } from "./FilmMessageContent";

export const Film = ({ filmId, ...props }: { filmId: string }) => {
  const { data, loading, error } = useQuery<{ characters: [string] }>({
    url: `${BASE_FILM_URL}${filmId}`,
  });
  if (error) {
    return <FilmMessageContent>{error.message}</FilmMessageContent>;
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
        return <Character key={`${characterUrl}`} url={characterUrl} />;
      })}
    </ul>
  );
};
