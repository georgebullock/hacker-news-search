import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import { ReactComponent as TrashIcon } from "./trash.svg";
import styles from "./App.module.scss";

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

  /***************************/
  /*       Render App       */
  /*************************/
  return (
    <main className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.headlinePrimary}>Hacker News Search</h1>
        <SearchForm
          handleSearch={handleSearch}
          searchTerm={searchTerm}
          searchSubmit={handleSearchSubmit}
        />
        {stories.isError && <div>Error: Cannot get stories</div>}
        {stories.isLoading ? (
          <div className={styles.loadingText}>Loading...</div>
        ) : (
          <List list={stories.data} onRemoveItem={handleRemoveStory} />
        )}
      </div>
    </main>
  );
};

/***************************/
/*    Other Components    */
/*************************/

const SearchForm = ({ handleSearch, searchTerm, handleSearchSubmit }) => {
  return (
    <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
      <Input
        isFocused={true}
        name="search"
        id="search"
        handleSearch={handleSearch}
      />
    </form>
  );
};

const Input = ({
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
    <input
      name={name}
      type={type}
      id={id}
      defaultValue="Search"
      value={value}
      onChange={handleSearch}
      ref={inputRef}
      className={styles.input}
    />
  );
};

const List = ({ list, onRemoveItem }) => {
  const items = list.map((item) => {
    return <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />;
  });

  return <ul className={styles.list}>{items}</ul>;
};

const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => {
    onRemoveItem(item.objectID);
  };

  return (
    <li className={styles.item}>
      <a href={item.url}>
        <span>{item.title}</span>
      </a>
      <p>
        <span>
          {`${item.points} points. ${item.num_comments} comments. By ${item.author}.`}
        </span>
      </p>
      <button
        className={`${styles.button} ${styles.buttonSmall}`}
        onClick={handleRemoveItem}
      >
        <TrashIcon style={{ width: "1.2rem", height: "1.2rem" }} />
      </button>
    </li>
  );
};

export default App;
