import { useQuery } from "../hooks/useQuery";

export const Character = ({ url }: { url: string }) => {
  const { data, loading, error } = useQuery<{ name: string }>({ url: url });
  if (error) {
    throw new Error(error.message);
  }
  if (loading) {
    return <>{`Retrieving...`}</>;
  }
  if (!data) {
    return <>{""}</>;
  }
  return <>{data.name}</>;
};
