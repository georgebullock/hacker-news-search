import React, { useState, useEffect, useRef, useReducer } from "react";
import "./App.css";

// Main app
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

  const storiesReducer = (stories, action) => {
    switch (action.type) {
      case "SET_STORIES":
        return action.payload;
      case "REMOVE_STORY":
        return stories.filter((story) => {
          console.log("action.payload.objectId: ", action);
          return action.payload !== story.objectId;
        });
      default:
        throw new Error("Error: Stories action not found");
    }
  };

  const [stories, dispatchStories] = useReducer(storiesReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const getAsyncStories = () => {
    Promise.resolve({ data: { stories: initialStories } })
      .then((res) => {
        setIsLoading(true);
        setTimeout(() => {
          dispatchStories({ type: "SET_STORIES", payload: res.data.stories });
          setIsLoading(false);
        }, 500);
      })
      .catch(() => {
        setIsError(true);
        return new Error("Error: Fetching stories failed");
      });
  };

  useEffect(getAsyncStories, []);

  const useSemiPersistentState = (key) => {
    let [value, setValue] = useState(localStorage.getItem(key) || "");

    useEffect(() => localStorage.setItem(key, value), [key, value]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRemoveStory = (id) => {
    dispatchStories({ type: "REMOVE_STORY", payload: id });
  };

  const filterStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
      {isError && <div>Error</div>}
      {isLoading ? (
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
