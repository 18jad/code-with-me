/* eslint-disable react-hooks/exhaustive-deps */
import { default as IDE } from "@monaco-editor/react";
import GithubTool from "assets/icons/GithubTool";
import ShareIcon from "assets/icons/ShareIcon";
import SidebarContent from "components/editor/SidebarContent";
import Modal from "components/Modal";
import TextLogo from "components/TextLogo";
import useKey from "hooks/useKey";
import useToast from "hooks/useToast";
import {
  Chats,
  Command,
  GearSix,
  LinkSimple,
  Play,
  Presentation,
  Stack,
  X,
} from "phosphor-react";
import { Resizable } from "re-resizable";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AiFillSave } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import io from "socket.io-client";
import { setProject } from "store/slices/projectSlice";
import { notificationToaster } from "utils/notificationToaster";
import { tw } from "utils/TailwindComponent";
import AccessDenied from "views/NotFound/AccessDenied";
import { ProfileController } from "views/Profile/profileController";
import styles from "./Editor.module.scss";
import { EditorController } from "./editorController";

const ParticipantsCircle = tw.img`
    inline-block
    h-8
    w-8
    rounded-full
    ring-2
    ring-white
    object-cover
    select-none
`;

const editorLanguage = {
  html: "html",
  css: "css",
  js: "javascript",
  php: "php",
  py: "python",
  rb: "ruby",
  sh: "shell",
  sql: "sql",
  txt: "plaintext",
  xml: "xml",
  md: "markdown",
  json: "json",
};

// Socket io connection
let socket =
  window.location.href.split("/")[3] === "project"
    ? io("http://localhost:2121", { forceNew: true, autoConnect: false })
    : null;

const Editor = () => {
  const [participants, setParticipants] = useState([]);

  const profileController = new ProfileController();
  const editorController = new EditorController();

  const [openedFile, setOpenedFile] = useState(null);
  const [fileCode, setFileCode] = useState("");

  const [terminal, setTerminal] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("Preview");

  const toast = useToast();

  let newJoin = true;

  const dispatch = useDispatch();

  const terminalRef = useRef(null);

  const { id } = useParams();

  const { user: loggedUser } = useSelector((state) => state.user);
  const { project } = useSelector((state) => state);

  const [allowed, setAllowed] = useState(true);

  const editorRef = useRef(null);

  const iframeRef = useRef(null);

  if (!socket && !socket?.connected) {
    socket = io("http://localhost:2121", { forceNew: true });
  }

  useEffect(() => {
    socket.on("user_joined", ({ users, user: joinedUser }) => {
      const roomUsers = users[id];

      newJoin
        ? roomUsers.forEach(({ user }) => {
            if (!user) return null;
            profileController
              .fetchUser(user)
              .then(({ id, username, avatar }) => {
                if (!participants.includes({ id, username, avatar })) {
                  setParticipants((prev) => [
                    ...new Map(
                      [...prev, { id, username, avatar }].map((item) => [
                        item["id"],
                        item,
                      ]),
                    ).values(),
                  ]);
                }
              })
              .catch((error) => console.log(error));
          })
        : profileController
            .fetchUser(joinedUser)
            .then(({ id, username, avatar }) => {
              if (!participants.includes({ id, username, avatar })) {
                setParticipants((prev) => [
                  ...new Map(
                    [...prev, { id, username, avatar }].map((item) => [
                      item["id"],
                      item,
                    ]),
                  ).values(),
                ]);
              }
            });
      newJoin = false;
      !newJoin &&
        joinedUser !== loggedUser.username &&
        notificationToaster(joinedUser + " joined the project");
    });

    socket.on("user_disconnected", (user) => {
      setParticipants((prev) => {
        const newParticipants = prev.filter(
          (participant) => participant.username !== user,
        );
        return newParticipants;
      });
      notificationToaster(user + " left the project", true);
    });
  }, [allowed]);

  useEffect(() => {
    socket?.connect();

    // Disconnect from socket on back button
    window.onpopstate = (e) => {
      socket?.close();
      socket?.disconnect(true);
      socket = null;
    };
    // Change page title to project title
    document.title = `${id} | CWM`;

    editorController
      .checkIfAllowed(id)
      .then(({ project, success }) => {
        if (success) {
          setAllowed(
            project.authorId === loggedUser.id ||
              project?.allowedUsers?.includes(loggedUser.id) ||
              false,
          );
          dispatch(
            setProject({
              project: project,
              link: `http://localhost:3000/invite/${project.inviteToken}`,
            }),
          );
          socket.emit("join_room", {
            room: id,
            username: loggedUser.username,
            participants,
          });
        }
      })
      .catch((err) => {
        setAllowed(false);
        console.log(err);
      });
  }, []);

  const runCode = () => {
    const document = iframeRef.current.contentDocument;
    const documentContents = `
              ${editorRef.current
                .getValue()
                .replaceAll("$cwm-link", `http://localhost:2121/file/${id}`)}
        `;

    document.open();
    document.write(documentContents);
    setPreviewTitle(document.title ? document.title : "Preview");
    document.close();
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editorRef.current.addAction({
      id: "shortcuts-ide",
      label: "Shortcuts",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.5,
      run: function (ed) {},
    });
  };

  useEffect(() => {
    editorController
      .readFile(id, openedFile)
      .then(({ message, file_content }) => {
        setFileCode({ code: file_content, isMe: true });
      })
      .catch((err) => console.log(err));
  }, [openedFile]);

  const handleCodeChange = (value) => {
    setFileCode({ code: value, isMe: true });
    socket.emit("code_edit", {
      room: id,
      code: value,
      file: openedFile,
      user: loggedUser.username,
    });
  };

  const handleFileSave = () => {
    if (!openedFile) return;
    editorController
      .saveFile(id, openedFile, editorRef.current.getValue())
      .then(({ message }) => {
        notificationToaster(message);
      })
      .catch((err) => console.log(err));
  };

  // CTRL + S callback
  useKey("ctrls", handleFileSave);

  socket.on("code_edit", ({ code, file, user }) => {
    file === openedFile &&
      user !== loggedUser.username &&
      fileCode !== code &&
      fileCode.isMe &&
      setFileCode({ code, isMe: false });
  });

  // Sidebar content switcher
  const [sidebarContent, setSidebarContent] = useState("files");

  // Modal show/hide status
  const [settingModalStatus, setSettingModalStatus] = useState(false);
  const [inviteModalStatus, setInviteModalStatus] = useState(false);
  const [previewModalStatus, setPreviewModalStatus] = useState(false);

  const storedSetting = localStorage.getItem("editor-setting");

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

  const updateTerminal = (show, output = "", error = false) => {
    setTerminal(show);
    terminalRef.current.innerText = output;
    if (error) {
      terminalRef.current.style.color = "red";
    } else {
      terminalRef.current.style.color = "white";
    }
  };

  return allowed ? (
    <div className={styles.editorWrapper}>
      {/* Navbar */}
      <div className={styles.navbar}>
        <div className={styles.logoWrapper}>
          <Link to='/profile'>
            <TextLogo
              text='Editor playground'
              className='hover:drop-shadow-vc'
              width={44}
              mainSize='lg'
              textSize='xs'
            />
          </Link>
        </div>
        <div className={styles.navbarTools}>
          {/* Voice chat bubbles wrapper */}
          <div className='flex -space-x-2'>
            {participants &&
              participants.map((user, index) => {
                return (
                  <ParticipantsCircle
                    key={index}
                    src={user?.avatar}
                    alt={user?.username}
                    title={user?.username}
                  />
                );
              })}
          </div>
          <button
            className={styles.share_btn}
            onClick={() => {
              setInviteModalStatus(true);
            }}>
            <span>Share</span>
            <ShareIcon className='text-white' width={13} />
          </button>
        </div>
      </div>

      <div className='flex flex-row h-full'>
        {/* Sidebar */}
        <Resizable
          defaultSize={{
            width: "350px",
            height: "100%",
          }}
          maxWidth='400px'
          minWidth='300px'
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
              {/* <button className={styles.sidebar_tools_tool}>
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
              </button> */}
              <button className={styles.sidebar_tools_tool}>
                <input
                  type='radio'
                  id='overview'
                  name='sectionSwitcher'
                  onClick={() => {
                    if (sidebarContent !== "shortcuts")
                      setSidebarContent("shortcuts");
                  }}
                  className={styles.radioSelection}
                />
                <div className={styles.selectLine}></div>
                <label htmlFor='overview' className={styles.toolIcon}>
                  <Command size={24} />
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
            <SidebarContent
              content={sidebarContent}
              socket={socket}
              fileFn={setOpenedFile}
            />
          </div>
        </Resizable>

        {/* Editor and tabs */}
        <div className='flex flex-col w-full'>
          <div className={styles.editor}>
            <div className={styles.tabs}>
              {/* <EditorTab
              name='index.html'
              isSelected={true}
              // onClick={(e) => {
              //   this.isSelected = true;
              // }}
            />
            <EditorTab
              name='script.js'
              isSelected={false}
              // onClick={(e) => {
              //   // change is selected to true
              //   e.target.dataset.selected = true;
              //   console.log(e.target);
              // }}
            />
            <EditorTab name='styles.csss' isSelected={false} /> */}
              <p className='text-white'>{openedFile}</p>
              <div className='h-[34px]' readOnly></div>
              {openedFile && openedFile.split(".").pop() === "js" && (
                <Play
                  className='text-white cursor-pointer hover:text-white/70 transition duration-150'
                  width={20}
                  weight='fill'
                  title='Run code'
                  onClick={() => {
                    editorController
                      .excuteCode(id, openedFile)
                      .then((res) => {
                        console.log(res);
                        updateTerminal(true, res.stdout);
                      })
                      .catch((err) => {
                        let exc_error = err.response?.data?.stderr.replace(
                          /\\n|\\r\\n|\\n\\r|\\r/g,
                          "<br>",
                        );
                        exc_error = exc_error.replace(
                          "C:\\Users\\Jad Yahya\\Documents\\SE Factory\\Web Development\\Projects\\FINAL PROJECT\\code-with-me\\backend\\public\\projects\\",
                          "",
                        );
                        console.log(err.response?.data?.stderr);
                        updateTerminal(true, exc_error || "Error", true);
                      });
                  }}
                />
              )}
              {openedFile && openedFile.split(".").pop() === "html" && (
                <Presentation
                  size={20}
                  className='text-white cursor-pointer hover:text-white/70 transition duration-150 mb-1'
                  weight='bold'
                  onClick={() => {
                    setPreviewModalStatus(true);
                    runCode();
                  }}
                />
              )}
              {openedFile && (
                <AiFillSave
                  className='text-white cursor-pointer hover:text-white/70 transition duration-150 absolute right-6 text-lg'
                  onClick={handleFileSave}
                />
              )}
            </div>
            <IDE
              height='100%'
              width='99.9%'
              onMount={handleEditorDidMount}
              className={`${openedFile ? "" : "hidden"}`}
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
              value={fileCode.code}
              language={
                editorLanguage[openedFile?.split(".").pop()] ||
                openedFile?.split(".").pop()
              }
              onChange={handleCodeChange}
            />
          </div>
          <div className={styles.terminal} hidden={!terminal}>
            <header className={styles.terminal_header}>
              <span>Terminal</span>
              <X
                size={20}
                color='currentColor'
                weight='bold'
                onClick={() => updateTerminal(false)}
                className={styles.terminalIcon}
              />
            </header>
            <p className={styles.terminal_description}>Output: </p>
            <div className={styles.terminal_output}>
              <p ref={terminalRef}></p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title='Editor Settings'
        isOpen={settingModalStatus}
        className='w-[400px]'
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
      <Modal
        title='Invite Someone'
        isOpen={inviteModalStatus}
        className='w-[400px]'
        bgDrop='bg-black/30'
        bg='#1e1e1e'
        onClick={() => {
          setInviteModalStatus(false);
        }}>
        <div className='email-invite flex flex-col gap-2 items-start justify-start w-full'>
          <h3 className='text-white'>Invite by email:</h3>
          <form
            className='email-input flex flex-row items-center gap-2 w-full'
            onSubmit={(e) => {
              editorController
                .shareProject(e)
                .then((result) => {
                  if (result?.success) {
                    notificationToaster("Invitation sent successfully");
                    e.target.reset();
                  }
                })
                .catch((error) => {
                  notificationToaster(
                    error?.response?.data?.message || error,
                    true,
                  );
                });
            }}>
            <input
              type='email'
              placeholder='Enter user email'
              name='email'
              className='bg-white/10 border shadow-sm px-4 py-1 placeholder-gray-300 border-gray-500 focus:border-gray-800  focus:ring-2 focus:bg-black/10 focus:ring-gray-500 outline-none rounded-sm transition duration-150 text-white w-full'
              required
            />
            <input
              type='text'
              placeholder='link'
              name='link'
              value={project.link}
              hidden
              readOnly
            />
            <button
              className='bg-blue-500 border shadow-sm px-4 py-1  border-blue-500 outline-none rounded-sm transition duration-150 text-white cursor-pointer hover:bg-blue-500/80'
              type='submit'>
              Invite
            </button>
          </form>
        </div>
        <span className='seperator text-white text-center m-auto flex items-center justify-center my-5'>
          OR
        </span>
        <div className='copy-link flex flex-col gap-2 items-center justify-center w-full'>
          <button
            className='bg-blue-500 border shadow-sm px-2 py-1  border-blue-500 outline-none rounded-sm transition duration-150 text-white cursor-pointer hover:bg-blue-500/80 flex flex-row items-center justify-center gap-2 w-[300px]'
            onClick={(e) => {
              navigator.clipboard.writeText(project.link);
              notificationToaster("Link copied to clipboard");
              e.target.innerText = "Copied";
              setTimeout(() => {
                e.target.innerText = "Copy invitation link";
              }, 1300);
            }}>
            <LinkSimple color='#fff' size={20} />
            <span>Copy invitation link</span>
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={previewModalStatus}
        className={`${
          isFullscreen ? "w-[100vw] h-[100vh]" : "w-[1000px] h-[700px]"
        }`}
        bgDrop='bg-black/30'
        title={previewTitle}
        onFull={() => {
          setIsFullscreen(!isFullscreen);
        }}
        onClick={() => {
          setPreviewModalStatus(false);
        }}>
        <iframe
          title='result'
          className='w-full h-full border-t-2 border-white/20'
          ref={iframeRef}
        />
      </Modal>
      <Toaster position='bottom-center' reverseOrder={false} />
    </div>
  ) : (
    <AccessDenied />
  );
};

export default Editor;
