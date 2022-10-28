import styles from "./styles/Editor.module.scss";

const Editor = () => {
  return (
    <div className={styles.editorWrapper}>
      {/* Navbar */}
      <div className={styles.navbar}></div>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        {/* Sidebar tools */}
        <div className={styles._tools}> </div>
        {/* Sidebar content */}
        <div className={styles._content}></div>
      </div>

      {/* Editor */}
      <div className={styles.editor}></div>
    </div>
  );
};

export default Editor;
