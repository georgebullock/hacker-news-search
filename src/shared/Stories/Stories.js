import React, { useEffect, useReducer, useCallback } from "react";
import { storiesReducer } from "../Stories/storiesReducer";

import List from "./../../shared/List/List";
import styles from "./Stories.module.scss";

const Stories = ({ url }) => {
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  /***************************/
  /*      Fetch Stories     */
  /*************************/
  const handleFetchData = useCallback(async () => {
    dispatchStories({ type: "STORIES_INIT_STORIES" });

    try {
      const response = await fetch(url)
        .then((res) => {
          if (!res.ok) return console.error(res);
          return res.json();
        })
        .then((res) => {
          const filteredRes = res.hits.filter((item) => {
            return item.url && item.title;
          });

          return {
            hits: filteredRes,
          };
        });

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: response.hits,
      });
    } catch (error) {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
      console.error(error);
    }
  }, [url]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  /***************************/
  /*      Remove Story      */
  /*************************/
  const handleRemoveStory = (id) => {
    dispatchStories({ type: "STORIES_REMOVE_STORY", payload: id });
  };

  return (
    <div className={styles.innerContainer}>
      {stories.isError && <div>Error: Cannot get stories</div>}

      {stories.isLoading ? (
        <div className={styles.loadingText}>Loading...</div>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

export default Stories;
