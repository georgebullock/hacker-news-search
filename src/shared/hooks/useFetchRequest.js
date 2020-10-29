import { useState, useEffect } from "react";

// A custom hook that uses the fetch api to query HNs for data
export const useFetchRequest = ({ url, onLoad, onSuccess, onError }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    onLoad();

    try {
      const fetchData = async () => {
        const res = await fetch(url);
        if (!res.ok) {
          onError();
          throw new Error("Fetch request response was not okay");
        }

        const data = await res.json();
        setData(data);
        onSuccess();
      };

      fetchData();
    } catch (error) {
      onError();
      throw new Error(error.message);
    }
  }, [onError, onLoad, onSuccess, url]);

  return { data };
};
