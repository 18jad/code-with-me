import { default as IDE } from "@monaco-editor/react";
import GithubTool from "assets/icons/GithubTool";
import ShareIcon from "assets/icons/ShareIcon";
import Voice from "assets/icons/Voice";
import SidebarContent from "components/editor/SidebarContent";
import EditorTab from "components/editor/Tab";
import TextLogo from "components/TextLogo";
import { Chats, GearSix, Stack } from "phosphor-react";
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

      <div className='flex flex-row h-full'>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Sidebar tools */}
          <div className={styles.sidebar_tools}>
            <div className={styles.sidebar_tools_upper}>
              <button className={styles.sidebar_tools_tool}>
                <input
                  type='radio'
                  id='overview'
                  name='sectionSwitcher'
                  className={styles.radioSelection}
                  defaultChecked
                />
                <div className={styles.selectLine}></div>
                <label htmlFor='overview' className={styles.toolIcon}>
                  <Stack size={28} color='currentColor' />
                </label>
              </button>
              <button className={styles.sidebar_tools_tool}>
                <input
                  type='radio'
                  id='overview'
                  name='sectionSwitcher'
                  className={styles.radioSelection}
                  defaultChecked
                />
                <div className={styles.selectLine}></div>
                <label htmlFor='overview' className={styles.toolIcon}>
                  <GithubTool width={22} />
                </label>
              </button>
              <button className={styles.sidebar_tools_tool}>
                <input
                  type='radio'
                  id='overview'
                  name='sectionSwitcher'
                  className={styles.radioSelection}
                  defaultChecked
                />
                <div className={styles.selectLine}></div>
                <label htmlFor='overview' className={styles.toolIcon}>
                  <Chats size={28} color='currentColor' />
                </label>
              </button>
              <button className={styles.sidebar_tools_tool}>
                <input
                  type='radio'
                  id='overview'
                  name='sectionSwitcher'
                  className={styles.radioSelection}
                  defaultChecked
                />
                <div className={styles.selectLine}></div>
                <label htmlFor='overview' className={styles.toolIcon}>
                  <Voice width={22} />
                </label>
              </button>
            </div>
            <div className={styles.sidebar_tools_bottom}>
              <button className={styles.settingsIcon}>
                <GearSix size={28} color='currentColor' />
              </button>
            </div>
          </div>
          {/* Sidebar content */}
          <div className={styles.sidebar_content}>
            <SidebarContent />
          </div>
        </div>

        {/* Editor and tabs */}
        <div className={styles.editor}>
          <div className={styles.tabs}>
            <EditorTab
              name='index.html'
              isSelected={true}
              onClick={(e) => {
                console.log(e.target);
              }}
            />
            <EditorTab name='script.js' isSelected={false} />
            <EditorTab name='styles.csss' isSelected={false} />
          </div>
          <IDE
            height='100%'
            width='100%'
            theme='vs-dark'
            options={{
              wordWrap: "on",
              showUnused: false,
              folding: false,
              lineNumbersMinChars: 3,
              fontSize: 16,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabCompletion: "on",
            }}
            defaultLanguage='javascript'
            defaultValue='// some comment'
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
