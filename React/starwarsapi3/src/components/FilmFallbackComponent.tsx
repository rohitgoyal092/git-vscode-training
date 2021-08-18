import React, { EventHandler } from "react";
import { FilmMessageContent } from "./FilmMessageContent";

export const FilmErrorBoundaryFallbackComponent = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: EventHandler<React.SyntheticEvent>;
}) => {
  return (
    <>
      <button className={`retry-button`} onClick={resetErrorBoundary}>
        Click to try again!
      </button>
      <FilmMessageContent>{error.message}</FilmMessageContent>
    </>
  );
};
