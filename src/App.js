import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import styles from "./App.module.css";

/***************************/
/*        Main App        */
/*************************/

const App = () => {
  /***************************/
  /*      State Mgmt        */
  /*************************/
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case "STORIES_INIT_STORIES":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "STORIES_FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "STORIES_FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case "STORIES_REMOVE_STORY":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: state.data.filter((story) => {
            return action.payload !== story.objectID;
          }),
        };
      default:
        throw new Error("Error: Stories action not found");
    }
  };

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  /***************************/
  /*        Search          */
  /*************************/

  const useSemiPersistentState = (key, initialState) => {
    let [value, setValue] = useState(localStorage.getItem(key) || initialState);

    useEffect(() => localStorage.setItem(key, value), [key, value]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "");

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
      const response = await fetch(url).then((res) => {
        if (!res.ok) return console.error(res);
        return res.json();
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

  /***************************/
  /*       Render App       */
  /*************************/
  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>Hacker Stories</h1>
      <SearchForm
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        searchSubmit={handleSearchSubmit}
      />
      {stories.isError && <div>Error: Cannot get stories</div>}
      {stories.isLoading ? (
        <div>Loading...</div>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

/***************************/
/*    Other Components    */
/*************************/

const SearchForm = ({ handleSearch, searchTerm, handleSearchSubmit }) => {
  return (
    <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
      <InputWithLabel
        isFocused={true}
        label="Search:"
        name="search"
        id="search"
        handleSearch={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <button
        className={`${styles.button} ${styles.buttonLarge}`}
        type="submit"
        disabled={!searchTerm}
      >
        Submit
      </button>
    </form>
  );
};

const InputWithLabel = ({
  isFocused,
  name,
  type = "text",
  id,
  value,
  handleSearch,
  children,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocused) inputRef.current.focus();
  }, [isFocused]);

  return (
    <>
      <label className={styles.label} htmlFor={id}>
        {children}
      </label>
      <input
        name={name}
        type={type}
        id={id}
        value={value}
        onChange={handleSearch}
        ref={inputRef}
        className={styles.input}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => {
  const items = list.map((item) => {
    return <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />;
  });

  return <ul>{items}</ul>;
};

const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => {
    onRemoveItem(item.objectID);
  };

  return (
    <li className={styles.item}>
      <span style={{ width: "40%" }}>Title: {item.title}</span>
      <span style={{ width: "30%" }}>Author: {item.author}</span>
      <span style={{ width: "10%" }}>Comments: {item.commentsCount}</span>
      <span style={{ width: "10%" }}>Link: {item.url}</span>
      <span style={{ width: "10%" }}>Points: {item.points}</span>
      <button
        className={`${styles.button} ${styles.buttonSmall}`}
        onClick={handleRemoveItem}
      >
        Delete
      </button>
    </li>
  );
};

export default App;
