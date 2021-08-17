import { useQuery } from "../hooks/useQuery";

export const Character = ({ url }: { url: string }) => {
  const { data, loading, error } = useQuery<{ name: string }>({ url: url });
  if (error) {
    return <>{error.message}</>;
  }
  if (loading) {
    return <>{`Retrieving...`}</>;
  }
  if (!data) {
    return <>{""}</>;
  }
  return <>{data.name}</>;
};
