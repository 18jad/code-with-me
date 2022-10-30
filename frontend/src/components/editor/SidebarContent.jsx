import GithubTool from "assets/icons/GithubTool";
import { useLayoutEffect, useState } from "react";
import { tw } from "utils/TailwindComponent";
import Tree from "./FileTree/Tree";
import Message from "./Message";
const structure = [
  {
    type: "folder",
    name: "project",
    files: [
      //     {
      //       type: "folder",
      //       name: "ui",
      //       files: [
      //         { type: "file", name: "Toggle.js" },
      //         { type: "file", name: "Button.js" },
      //         { type: "file", name: "Button.style.js" },
      //       ],
      //     },
      //     {
      //       type: "folder",
      //       name: "components",
      //       files: [
      //         { type: "file", name: "Tree.js" },
      //         { type: "file", name: "Tree.style.js" },
      //       ],
      //     },
      //     { type: "file", name: "setup.js" },
      //     { type: "file", name: "setupTests.js" },
      //   ],
      // },
      // {
      //   type: "folder",
      //   name: "packages",
      //   files: [
      //     {
      //       type: "file",
      //       name: "main.js",
      //     },
    ],
  },
  // { type: "file", name: "index.js" },
];

const Input = tw.input`
    bg-white/10
    border
    shadow-sm
    px-3
    py-[2px]
    placeholder-gray-400
    border-gray-500
    focus:border-gray-800 
    focus:ring-2
    focus:bg-black/10
    focus:ring-gray-500
    outline-none
    rounded-sm
    text-sm
    transition
    duration-150
    text-white
    w-11/12
`;

const FileStructure = ({ className }) => {
  let [data, setData] = useState(structure);

  const handleClick = (node) => {
    console.log(node);
  };
  const handleUpdate = (state) => {
    localStorage.setItem(
      "tree",
      JSON.stringify(state, function (key, value) {
        if (key === "parentNode" || key === "id") {
          return null;
        }
        return value;
      }),
    );
  };

  useLayoutEffect(() => {
    try {
      let savedStructure = JSON.parse(localStorage.getItem("tree"));
      if (savedStructure) {
        // setData(savedStructure);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2'>Project Name</h2>
      <Tree data={data} onUpdate={handleUpdate} onNodeClick={handleClick} />
    </div>
  );
};

const GithubRepo = ({ className }) => {
  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2'>Github</h2>
      <div className='content flex flex-col items-center mt-5 px-2 gap-4 border-b-2 border-[#232526] pb-5'>
        {/* TODO: Change to github connect status */}
        {false ? (
          <>
            <button className='py-1 bg-black/20 w-11/12 rounded border border-white/10 hover:bg-black/40 transition duration-200 flex items-center justify-center text-white gap-3'>
              <GithubTool width={15} />
              <span>Connect to github</span>
            </button>
          </>
        ) : (
          <div className='inputs-wrapper flex flex-col items-center w-full gap-3'>
            <div className='input flex flex-col gap-1 w-full items-center text-left'>
              <label
                htmlFor='repo-name'
                className='text-left self-start ml-3 text-sm'>
                Repository name
              </label>
              <Input placeholder='Enter a name' id='repo-name' />
            </div>
            <div className='input flex flex-col gap-1 w-full items-center text-left'>
              <label
                htmlFor='repo-description'
                className='text-left self-start ml-3 text-sm'>
                Repository description
              </label>
              <textarea
                placeholder='Enter description'
                className='
                  bg-white/10 border shadow-sm px-2 py-1 placeholder-gray-400 border-gray-500 focus:border-gray-800  focus:ring-2 focus:bg-black/10 focus:ring-gray-500 text-sm outline-none rounded-sm transition duration-150 text-white h-[130px] resize-none w-11/12
              '
                id='repo-description'></textarea>
            </div>
            <button className='px-2 py-1 border border-white/10 rounded text-sm hover:bg-white/10 transition duration-200 shadow'>
              Create and push
            </button>
          </div>
        )}
      </div>
      <div>
        <h2 className='px-4 pt-4 pb-2'>How it works?</h2>
        <div className='px-2'>
          {/* ordered list */}
          <ol className='list-decimal list-inside text-sm text-gray px-2 flex flex-col gap-3'>
            <li>
              <span className='font-bold'>Connect</span> your github account to
              the editor
            </li>
            <li>
              <span className='font-bold'>Choose</span> a repository name
            </li>
            <li>
              <span className='font-bold'>Choose</span> a repository description
              (Optional)
            </li>
            <li>
              <span className='font-bold'>
                Create a repository and push files
              </span>{" "}
              on github by clicking on the button
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

const ChatConversation = ({ className }) => {
  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2 sticky top-0 self-stretch bg-[#1e1e1e] overflow-hidden'>
        Chat
      </h2>
      <div className='chat-section'>
        <div className='messages-container p-2 overflow-auto h-[720px]'>
          <Message
            message='first message'
            time='12:32'
            isMe={false}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={false}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={false}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={false}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={false}
            senderName='Jad Yahya'
          />
          <Message
            message='last message last messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast message'
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
        </div>
        <form action=''>
          <input
            type='text'
            className='fixed bottom-0 w-[260px] px-3 bg-[#232526] py-3  border-t border-white/5 outline-none'
            placeholder='Enter a message'
            required
          />
        </form>
      </div>
    </div>
  );
};

const SidebarContent = ({ content }) => {
  // Here we are hiding the element under the current active element
  // Instead of just rendering another component
  // This is to prevent the sidebar content from being re-rendered and losing old content/state
  return (
    <>
      <FileStructure
        className={`${
          content === "fileTree"
            ? "opacity-1"
            : "opacity-0 h-0 w-0 -z-50 pointer-events-none"
        } sticky top-0 self-stretch`}
      />
      <GithubRepo
        className={`${
          content === "github"
            ? "opacity-1"
            : "opacity-0 h-0 w-0 -z-50 pointer-events-none"
        } sticky top-0 self-stretch`}
      />
      <ChatConversation
        className={`${
          content === "chat"
            ? "opacity-1"
            : "opacity-0 h-0 w-0 -z-50 pointer-events-none"
        }`}
      />
    </>
  );
};

export default SidebarContent;
