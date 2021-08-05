import { useQuery } from "../hooks/useQuery";

export const Character = ({ url, ...props }: { url: string }) => {
  const { data, loading, error } = useQuery<{ name: string }>({ url: url });
  if (error) {
    return <div className={`character no-border`}>{error.message}</div>;
  }
  if (loading) {
    return <div className={`character no-border`}>{`Retrieving...`}</div>;
  }
  if (!data) {
    return <div className={`character no-border`}>{""}</div>;
  }
  return <div className={`character`}>{data.name}</div>;
};
