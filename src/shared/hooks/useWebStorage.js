import { useState, useEffect } from "react";

export const useWebStorage = (key, initialState) => {
  let [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => localStorage.setItem(key, value), [key, value]);

  return [value, setValue];
};
