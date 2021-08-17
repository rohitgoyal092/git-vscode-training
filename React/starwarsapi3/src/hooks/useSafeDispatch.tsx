import React from "react";
export const useSafeDispatch = (dispatch: Function): Function => {
  const safeToUse = React.useRef<boolean>(false);
  React.useLayoutEffect(() => {
    safeToUse.current = true;
    return () => {
      safeToUse.current = false;
    };
  }, []);
  return React.useCallback(
    (...args: any[]) => {
      return safeToUse.current ? dispatch(...args) : void 0;
    },
    [dispatch]
  );
};
