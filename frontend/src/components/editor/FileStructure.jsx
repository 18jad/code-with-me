import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import Tree from "./FileTree/Tree";

const structure = [
  {
    type: "folder",
    name: "project",
    path: "/projects/project",
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
];

const FileStructure = ({ className, socket }) => {
  const fileStructure = useSelector(
    (state) => state.project?.project?.fileStructure,
  );

  let [data, setData] = useState(structure);

  // Recursion file path update
  const updatePath = (fileStorage, mainPath) => {
    const files = fileStorage[0]?.files || fileStorage?.files;
    files.length > 0 &&
      files.forEach((file) => {
        console.log("This files", file);
        if (file.type === "file") {
          // copy file
          const copyFile = { ...file };
          copyFile.path = `${mainPath}/${file.name}`;
          // file.path = `${mainPath}/${file.name}`; //TODO: handle file not extensible error
        } else if (file.type === "folder") {
          updatePath(file, `${mainPath}/${file.name}`);
        }
      });
  };

  const handleClick = (node) => {
    console.log(node);
    const filePath = node.node.path;
    console.log("Clicked file path: ", filePath);
  };
  const handleUpdate = (state) => {
    const mainState = state[0];
    const mainPath = mainState.path;
    updatePath(mainState, mainPath);
    socket.emit("create_file", { newStructure: state, room: state[0].name });
    console.log("bew file", state);
  };

  useEffect(() => {
    let incept = 0;
    socket.on("create_file", (data) => {
      console.log(data);
      incept === 0 && setData(data.newStructure);
      incept++;
      setTimeout(() => {
        incept = 0;
      }, 1000);
    });
  }, []);

  useLayoutEffect(() => {
    try {
      setData([fileStructure]);
    } catch (err) {
      console.log(err);
    }
  }, [fileStructure]);
  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2'>Project Name</h2>
      <Tree data={data} onUpdate={handleUpdate} onNodeClick={handleClick} />
    </div>
  );
};

export default FileStructure;
