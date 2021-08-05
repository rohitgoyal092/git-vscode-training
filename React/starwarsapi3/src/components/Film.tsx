import { useQuery } from "../hooks/useQuery";
import { BASE_FILM_URL } from "../constants/components/Film";
import { Character } from "./Character";

export const Film = ({ filmId, ...props }: { filmId: number }) => {
  const { data, loading, error } = useQuery<{ characters: [string] }>({
    url: `${BASE_FILM_URL}${filmId}`,
  });
  if (error) {
    return <div className={`film no-border`}>{error.message}</div>;
  }
  if (loading) {
    return <div className={`film no-border`}>{`Retrieving...`}</div>;
  }
  if (!data) {
    return <div className={`film no-border`}>{""}</div>;
  }
  return (
    <ul className={`film`}>
      {data["characters"].map((characterUrl) => {
        return <Character key={`${characterUrl}`} url={characterUrl} />;
      })}
    </ul>
  );
};
