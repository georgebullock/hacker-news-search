import React, { useState, useEffect, useReducer, useCallback } from "react";
import { useWebStorage } from "./../../shared/hooks/useWebStorage";
import { storiesReducer } from "../Stories/storiesReducer";
import SearchForm from "./../../shared/SearchForm/SearchForm";
import List from "./../../shared/List/List";
import styles from "./Stories.module.scss";

const Stories = () => {
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  /***************************/
  /*         Search         */
  /*************************/
  const [searchTerm, setSearchTerm] = useWebStorage("search", "");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    setUrl(`${FETCH_URL}${searchTerm}`);
    e.preventDefault();
  };

  /***************************/
  /*      Fetch Data        */
  /*************************/
  const FETCH_URL = "https://hn.algolia.com/api/v1/search?query=";

  const [url, setUrl] = useState(`${FETCH_URL}${searchTerm}`);

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
      <header className={styles.header}>
        <h1 className={styles.headlineMain}>Hacker News Search</h1>
        <SearchForm
          handleSearch={handleSearch}
          searchTerm={searchTerm}
          searchSubmit={handleSearchSubmit}
        />
      </header>

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
