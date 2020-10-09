import React from "react";
import Stories from "./../../shared/Stories/Stories";
import styles from "./App.module.scss";

/***************************/
/*        Main App        */
/*************************/

const App = () => {
  return (
    <main className={styles.container}>
      <Stories />
    </main>
  );
};

export default App;
