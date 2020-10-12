import { useState, useEffect } from "react";
// A custom hook that uses the fetch api to query HNs for data

export const useFetchRequest = ({ url, onLoad, onSuccess, onError }) => {
  // 2. Data state
  const [data, setData] = useState({});

  // 3. Define effect
  useEffect(() => {
    // 1.  Status state
    onLoad();

    try {
      // 4. Create function to fetch data
      const fetchData = async () => {
        // 5. Fetch data
        const res = await fetch(url);
        console.log("res: ", res);
        if (!res.ok) return;

        // 6. Convert the response to JSON
        const data = await res.json();
        console.log("data: ", data);

        // 7. Set Data
        setData(data);

        // 8. Set status state
        onSuccess();
      };

      fetchData();
    } catch {
      console.error("Fetch request failed");
      onError();
    }
  }, [onError, onLoad, onSuccess, url]);

  return { data };
};
