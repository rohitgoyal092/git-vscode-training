import { useQuery } from "../hooks/useQuery";
import { CharacterMessageContent } from "./CharacterMessageContent";

export const Character = ({ url }: { url: string }) => {
  const { data, loading, error } = useQuery<{ name: string }>({ url: url });
  if (error) {
    return <CharacterMessageContent>{error.message}</CharacterMessageContent>;
  }
  if (loading) {
    return <CharacterMessageContent>{`Retrieving...`}</CharacterMessageContent>;
  }
  if (!data) {
    return <CharacterMessageContent>{""}</CharacterMessageContent>;
  }
  return <div className={`character`}>{data.name}</div>;
};
