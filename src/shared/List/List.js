import React from "react";
import { ReactComponent as TrashIcon } from "./../../assets/icons/trash.svg";
import styles from "./List.module.scss";

const iconStyles = { width: "1.2rem", height: "1.2rem" };

const List = ({ list, onRemoveItem }) => {
  const items = list.hits.map((item) => {
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
      <button className={styles.button} onClick={handleRemoveItem}>
        <TrashIcon style={{ ...iconStyles }} />
      </button>
    </li>
  );
};

export default List;
