import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import "./App.css";

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
            return action.payload !== story.objectId;
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

  const handleSearchSubmit = () => {
    setUrl(`${FETCH_URL}${searchTerm}`);
  };

  /***************************/
  /*      Fetch Data        */
  /*************************/
  const FETCH_URL = "https://hn.algolia.com/api/v1/search?query=";

  const [url, setUrl] = useState(`${FETCH_URL}${searchTerm}`);

  const handleFetchData = useCallback(() => {
    dispatchStories({ type: "STORIES_INIT_STORIES" });

    fetch(url)
      .then((res) => {
        if (!res.ok) return console.error(res);
        return res.json();
      })
      .then((result) => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.hits,
        });
      })
      .catch((error) => {
        dispatchStories({ type: "STORIES_FETCH_FAILURE" });
        console.error(error);
      });
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
    <div className="App">
      <h1>Hacker Stories</h1>
      <InputWithLabel
        isFocused={true}
        label="Search:"
        name="search"
        id="search"
        handleSearch={handleSearch}
        searchTerm={searchTerm}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>
        Submit
      </button>

      <hr />
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
      <label htmlFor={id}>{children}</label>
      <input
        name={name}
        type={type}
        id={id}
        value={value}
        onChange={handleSearch}
        ref={inputRef}
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
    onRemoveItem(item.objectId);
  };

  return (
    <li>
      <p>Title: {item.title}</p>
      <p>Link: {item.url}</p>
      <p>Author: {item.author}</p>
      <p>Comments: {item.commentsCount}</p>
      <p>Points: {item.points}</p>
      <button onClick={handleRemoveItem}>Delete</button>
    </li>
  );
};

export default App;
