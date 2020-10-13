import React from "react";
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

const Stories = ({ stories }) => {
  /***************************/
  /*      Remove Story      */
  /*************************/
  const handleRemoveStory = (id) => {};

  console.log("stories: ", stories);

  return (
    <div className={styles.innerContainer}>
      <List list={stories} onRemoveItem={handleRemoveStory} />
    </div>
  );
};

export default WithRequest(getQualifyingHits)(Stories);
