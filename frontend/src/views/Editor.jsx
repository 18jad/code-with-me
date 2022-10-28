import ShareIcon from "assets/icons/ShareIcon";
import TextLogo from "components/TextLogo";
import { tw } from "utils/TailwindComponent";
import styles from "./styles/Editor.module.scss";

const VoiceChatCircle = tw.img`
    inline-block
    h-8
    w-8
    rounded-full
    ring-2
    ring-white
    object-cover
    select-none
`;

const Editor = () => {
  return (
    <div className={styles.editorWrapper}>
      {/* Navbar */}
      <div className={styles.navbar}>
        <div className={styles.logoWrapper}>
          <TextLogo
            text='Editor playground'
            width={50}
            mainSize='xl'
            textSize='sm'
          />
        </div>
        <div className={styles.navbarTools}>
          {/* Voice chat bubbles wrapper */}
          <div className='flex -space-x-2'>
            <VoiceChatCircle
              src='https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              alt=''
            />
            <VoiceChatCircle
              src='https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              alt=''
            />
            <VoiceChatCircle
              src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'
              alt=''
            />
            <VoiceChatCircle
              src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              alt=''
            />
          </div>
          <button className={styles.share_btn}>
            <span>Share</span>
            <ShareIcon className='text-white' width={13} />
          </button>
        </div>
      </div>

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
