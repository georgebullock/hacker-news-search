import React, { useState, useEffect, useRef, useReducer } from "react";
import "./App.css";

/***************************/
/*        Main App        */
/*************************/
const App = () => {
  const initialStories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      commentsCount: 3,
      points: 4,
      objectId: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov and Andrew Clark",
      commentsCount: 2,
      points: 5,
      objectId: 1,
    },
  ];

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
      case "STORIES_FETCH_STORIES":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
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
  /*      Fetch Data        */
  /*************************/
  const getAsyncStories = () => {
    dispatchStories({ type: "STORIES_INIT_STORIES" });
    Promise.resolve({ data: { stories: initialStories } })
      .then((res) => {
        setTimeout(() => {
          dispatchStories({
            type: "STORIES_FETCH_STORIES",
            payload: res.data.stories,
          });
        }, 500);
      })
      .catch(() => {
        return new Error("Error: Fetching stories failed");
      });
  };

  useEffect(() => {
    getAsyncStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /***************************/
  /*        Search          */
  /*************************/

  const useSemiPersistentState = (key) => {
    let [value, setValue] = useState(localStorage.getItem(key) || "");

    useEffect(() => localStorage.setItem(key, value), [key, value]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterStories = stories.data.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
      <hr />
      {stories.isError && <div>Error</div>}
      {stories.isLoading ? (
        <div>Loading...</div>
      ) : (
        <List list={filterStories} onRemoveItem={handleRemoveStory} />
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
    return <Item key={item.objectId} item={item} onRemoveItem={onRemoveItem} />;
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
