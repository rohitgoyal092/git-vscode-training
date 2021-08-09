import { useQuery } from "../hooks/useQuery";
import { BASE_FILM_URL } from "../constants/components/Film";
import { Character } from "./Character";
import { MessageContent } from "./MessageContent";

export const Film = ({ filmId, ...props }: { filmId: number }) => {
  const { data, loading, error } = useQuery<{ characters: [string] }>({
    url: `${BASE_FILM_URL}${filmId}`,
  });
  if (error) {
    return <MessageContent>{error.message}</MessageContent>;
  }
  if (loading) {
    return <MessageContent>{`Retrieving...`}</MessageContent>;
  }
  if (!data) {
    return <MessageContent>{""}</MessageContent>;
  }
  return (
    <ul className={`film`}>
      {data["characters"].map((characterUrl) => {
        return <Character key={`${characterUrl}`} url={characterUrl} />;
      })}
    </ul>
  );
};
