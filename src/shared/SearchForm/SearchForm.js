import React, { useEffect, useRef } from "react";
import styles from "./SearchForm.module.scss";

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

export default SearchForm;
