import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const stories = [
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

  const useSemiPersistentState = (key) => {
    let [value, setValue] = useState(localStorage.getItem(key) || "");

    useEffect(() => localStorage.setItem(key, value), [key, value]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
      <List list={filterStories} />
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
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        autoFocus={isFocused}
        name={name}
        type={type}
        id={id}
        value={value}
        onChange={handleSearch}
      />
    </>
  );
};

const List = ({ list }) => {
  const items = list.map((item) => {
    return <Item key={item.objectId} item={item} />;
  });

  return <ul>{items}</ul>;
};

const Item = ({ item }) => {
  return (
    <li>
      <p>Title: {item.title}</p>
      <p>Link: {item.url}</p>
      <p>Author: {item.author}</p>
      <p>Comments: {item.commentsCount}</p>
      <p>Points: {item.points}</p>
    </li>
  );
};

export default App;
