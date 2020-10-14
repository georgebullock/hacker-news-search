import React, { useState } from "react";
import { WithRequest } from "../hocs/WithRequest";
import List from "./../../shared/List/List";
import styles from "./Stories.module.scss";

const getQualifyingHits = (data) => {
  return {
    hits: data.hits.filter((item) => {
      return item.title && item.url;
    }),
  };
};

const Stories = ({ stories, onRemoveItem }) => {
  const [filteredStories, setFilteredStories] = useState(stories.hits);

  const handleOnRemove = (id) => {
    const newFilteredStories = filteredStories.filter((item) => {
      return item.objectID !== id;
    });

    setFilteredStories(newFilteredStories);
  };

  return (
    <div className={styles.innerContainer}>
      <List list={filteredStories} onRemoveItem={handleOnRemove} />
    </div>
  );
};

export default WithRequest(getQualifyingHits)(Stories);
