import { default as IDE } from "@monaco-editor/react";
import GithubTool from "assets/icons/GithubTool";
import ShareIcon from "assets/icons/ShareIcon";
import Voice from "assets/icons/Voice";
import SidebarContent from "components/editor/SidebarContent";
import EditorTab from "components/editor/Tab";
import Modal from "components/Modal";
import TextLogo from "components/TextLogo";
import { Chats, GearSix, Stack } from "phosphor-react";
import { Resizable } from "re-resizable";
import { useRef, useState } from "react";
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
  // Sidebar content switcher
  const [sidebarContent, setSidebarContent] = useState("files");

  // Modal show/hide status
  const [settingModalStatus, setSettingModalStatus] = useState(false);

  const storedSetting = localStorage.getItem("editor-setting");

  const sideBarRef = useRef(null);

  const handleMouseDown = (e) => {
    console.log(sideBarRef.current.offsetWidth);
  };

  // Editor settings
  const [editorSettings, setEditorSetting] = useState({
    fontSize: storedSetting ? JSON.parse(storedSetting).fontSize : 16,
    wordWrap: storedSetting ? JSON.parse(storedSetting).wordWrap : true,
    darkMode: storedSetting ? JSON.parse(storedSetting).darkMode : true,
  });

  const updateStoredSetting = (newSetting) => {
    localStorage.setItem("editor-setting", JSON.stringify(newSetting));
    setEditorSetting(newSetting);
  };

  // Increase editor font size
  const increaseFontSize = () => {
    updateStoredSetting({
      ...editorSettings,
      // Max font size is 20
      fontSize: editorSettings.fontSize < 20 ? editorSettings.fontSize + 1 : 20,
    });
  };

  // Decrease editor font size
  const decreaseFontSize = () => {
    updateStoredSetting({
      ...editorSettings,
      // Min font size is 10
      fontSize: editorSettings.fontSize > 10 ? editorSettings.fontSize - 1 : 10,
    });
  };

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
        <Resizable
          defaultSize={{
            width: "20%",
            height: "100%",
          }}
          maxWidth='25%'
          minWidth='18%'
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          className={styles.sidebar}>
          {/* Sidebar tools */}
          <div className={styles.sidebar_tools}>
            <div className={styles.sidebar_tools_upper}>
              <button className={styles.sidebar_tools_tool}>
                <input
                  type='radio'
                  id='overview'
                  name='sectionSwitcher'
                  onClick={() => {
                    if (sidebarContent !== "files") setSidebarContent("files");
                  }}
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
                  onClick={() => {
                    if (sidebarContent !== "github")
                      setSidebarContent("github");
                  }}
                  className={styles.radioSelection}
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
                  onClick={() => {
                    if (sidebarContent !== "chat") setSidebarContent("chat");
                  }}
                  className={styles.radioSelection}
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
                  onClick={() => {
                    if (sidebarContent !== "voice") setSidebarContent("voice");
                  }}
                  className={styles.radioSelection}
                />
                <div className={styles.selectLine}></div>
                <label htmlFor='overview' className={styles.toolIcon}>
                  <Voice width={22} />
                </label>
              </button>
            </div>
            <div className={styles.sidebar_tools_bottom}>
              <button
                className={styles.settingsIcon}
                onClick={() => {
                  setSettingModalStatus(true);
                }}>
                <GearSix size={28} color='currentColor' />
              </button>
            </div>
          </div>
          {/* Sidebar content */}
          <div className={styles.sidebar_content}>
            <SidebarContent content={sidebarContent} />
          </div>
        </Resizable>

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
            width='99.9%'
            theme={editorSettings.darkMode ? "vs-dark" : "light"}
            options={{
              wordWrap: editorSettings.wordWrap ? "on" : "off",
              showUnused: true,
              lineNumbersMinChars: 3,
              fontSize: editorSettings.fontSize,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabCompletion: "on",
              padding: {
                top: 5,
              },
            }}
            defaultLanguage='javascript'
            defaultValue='console.log("Hello World")'
          />
        </div>
      </div>
      <Modal
        title='Editor Settings'
        isOpen={settingModalStatus}
        className='w-[400px]'
        bgDrop='bg-black/30'
        bg='#1e1e1e'
        onClick={() => {
          setSettingModalStatus(false);
        }}>
        <form className='inputs flex flex-col gap-4'>
          <div className='flex flex-row gap-4 items-center'>
            <label
              htmlFor='custom-input-number'
              className='whitespace-nowrap text-white text-lg font-semibold'>
              Font Size :
            </label>
            <div className='flex flex-row h-10 w-1/2 rounded-lg relative bg-transparent'>
              <button
                onClick={decreaseFontSize}
                type='button'
                className=' bg-gray-700/20 text-gray-600 hover:text-gray-700 hover:bg-gray-700/40 text-white h-full w-20 rounded-l cursor-pointer outline-none'>
                <span className='m-auto text-2xl font-thin'>−</span>
              </button>
              <input
                type='number'
                className='outline-none focus:outline-none text-center w-full bg-gray-700/20 font-semibold text-md text-white  md:text-basecursor-default flex items-center text-gray-700 select-none pointer-events-none'
                name='custom-input-number'
                value={editorSettings.fontSize}
                readOnly></input>
              <button
                onClick={increaseFontSize}
                type='button'
                className='bg-gray-700/20 text-gray-600 hover:text-gray-700 hover:bg-gray-700/40 text-white h-full w-20 rounded-r cursor-pointer'>
                <span className='m-auto text-2xl font-thin'>+</span>
              </button>
            </div>
          </div>
          <div className='flex flex-row gap-4 items-center'>
            <label
              htmlFor='custom-input-number'
              className='whitespace-nowrap text-white text-lg font-semibold'>
              Word Wrap :
            </label>
            <div className='relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in'>
              <input
                type='checkbox'
                name='wordWrap-toggle'
                onClick={(e) => {
                  updateStoredSetting({
                    ...editorSettings,
                    wordWrap: e.target.checked,
                  });
                }}
                className={`toggle-checkbox absolute  w-6 h-6 rounded-full  ${
                  editorSettings.wordWrap
                    ? "right-0 bg-black/80"
                    : "left-0 bg-black/20"
                } border-2 border-gray-300 appearance-none cursor-pointer  `}
              />
              <label
                htmlFor='toggle'
                className={`toggle-label block  overflow-hidden h-6 rounded-full ${
                  editorSettings.wordWrap ? "bg-green-400" : "bg-gray-700/40"
                } cursor-pointer`}
                onClick={(e) => {
                  updateStoredSetting({
                    ...editorSettings,
                    wordWrap: !editorSettings.wordWrap,
                  });
                }}></label>
            </div>
          </div>
          <div className='flex flex-row gap-4 items-center'>
            <label
              htmlFor='custom-input-number'
              className='whitespace-nowrap text-white text-lg font-semibold'>
              Dark Mode :
            </label>
            <div className='relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in'>
              <input
                type='checkbox'
                name='darkmode-toggle'
                onClick={(e) => {
                  updateStoredSetting({
                    ...editorSettings,
                    darkMode: e.target.checked,
                  });
                }}
                className={`toggle-checkbox absolute  w-6 h-6 rounded-full  ${
                  editorSettings.darkMode
                    ? "right-0 bg-black/80"
                    : "left-0 bg-black/20"
                } border-2 border-gray-300 appearance-none cursor-pointer  `}
              />
              <label
                htmlFor='toggle'
                className={`toggle-label block  overflow-hidden h-6 rounded-full ${
                  editorSettings.darkMode ? "bg-green-400" : "bg-gray-700/40"
                } cursor-pointer`}
                onClick={(e) => {
                  updateStoredSetting({
                    ...editorSettings,
                    darkMode: !editorSettings.darkMode,
                  });
                }}></label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Editor;
