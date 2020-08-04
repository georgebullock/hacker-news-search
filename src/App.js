import React, { useState, useEffect, useRef } from "react";
import "./App.css";

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

  const [stories, setStories] = useState([]);

  const getAsyncStories = () => {
    Promise.resolve({ data: { stories: initialStories } }).then((res) => {
      setTimeout(() => {
        setStories(res.data.stories);
      }, 1000);
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
    const updatedStories = stories.filter((story) => {
      return story.objectId !== id;
    });

    setStories(updatedStories);
    console.log("Remove Story");
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
      <List list={filterStories} onRemoveItem={handleRemoveStory} />
    </div>
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
    console.log("item.objectId: ", item.objectId);
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

