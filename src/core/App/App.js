import React, { useState } from "react";
import Stories from "./../../shared/Stories/Stories";
import SearchForm from "./../../shared/SearchForm/SearchForm";
import { useWebStorage } from "./../../shared/hooks/useWebStorage";
import styles from "./App.module.scss";

const App = () => {
  const [searchTerm, setSearchTerm] = useWebStorage("search", "");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const FETCH_URL = "https://hn.algolia.com/api/v1/search?query=";

  const [url, setUrl] = useState(`${FETCH_URL}${searchTerm}`);

  const handleSearchSubmit = (e) => {
    setUrl(`${FETCH_URL}${searchTerm}`);
    e.preventDefault();
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headlineMain}>Hacker News Search</h1>
        <SearchForm
          handleSearch={handleSearch}
          searchTerm={searchTerm}
          searchSubmit={handleSearchSubmit}
        />
      </header>
      <Stories url={url} />
    </main>
  );
};

export default App;
