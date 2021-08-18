import { EventHandler } from "react";

export const CharacterFallbackComponent = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: EventHandler<React.SyntheticEvent>;
}) => {
  return (
    <>
      <div>{error.message}</div>
      <button className={`retry-button`} onClick={resetErrorBoundary}>
        Click to try again!
      </button>
    </>
  );
};
