import React, { useCallback, useState } from "react";
import { useFetchRequest } from "../hooks/useFetchRequest";

// An HOC that returns a component based on a fetch request's response value
export const WithRequest = (mapDataFn) => {
  return function (Component) {
    return function ComponentLoader({ url }) {
      const [loadState, setLoadState] = useState("Init");

      const onLoad = useCallback(() => {
        setLoadState("loading");
      }, []);

      const onSuccess = useCallback(() => {
        setLoadState("success");
      }, []);

      const onError = useCallback(() => {
        setLoadState("error");
      }, []);

      const responseState = useFetchRequest({
        url,
        onLoad,
        onSuccess,
        onError,
      });

      console.log("responseState.data: ", responseState.data);

      return (
        <div className="loader">
          {(loadState === "loading" || loadState === "init") && (
            <div>Loading...</div>
          )}
          {(loadState === "success" && (
            <Component stories={mapDataFn(responseState.data)} />
          )) ||
            (loadState === "error" && <div>Error Fetching </div>) ||
            null}
        </div>
      );
    };
  };
};
