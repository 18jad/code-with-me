// NOTE YOU WILL NOTICE A LOT OF COMMENTED CODE, SOME FEATURE WAS IMPLEMENTED ON FRONTEND FIRST VERS BUT WAS CAUSING A LOT OF PROBLEMS BACKEND.
// SO I COMMENTED IT OUT FOR FUTURE REFERENCE ONLY

import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import Tree from "./FileTree/Tree";

const structure = [
  {
    type: "folder",
    name: "project",
    path: "/projects/project",
    files: [
      // Example of how files are structured, note nested files and folder feature has been removed
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

const FileStructure = ({ className, socket, fileFn }) => {
  const fileStructure = useSelector(
    (state) => state.project?.project?.fileStructure,
  );

  let [data, setData] = useState(structure);

  // Recursion file path update
  // const updatePath = (fileStorage, mainPath) => {
  //   const files = fileStorage[0]?.files || fileStorage?.files;
  //   files.length > 0 &&
  //     files.forEach((file) => {
  //       if (file.type === "file") {
  //         // copy file
  //         const copyFile = { ...file };
  //         copyFile.path = `${mainPath}/${file.name}`;
  //         // file.path = `${mainPath}/${file.name}`; //TODO: handle file not extensible error
  //       } else if (file.type === "folder") {
  //         updatePath(file, `${mainPath}/${file.name}`);
  //       }
  //     });
  // };

  const handleClick = (node) => {
    if (node.node.type === "file") {
      fileFn(node.node.name);
    }
    // const filePath = node.node.path;
  };
  const handleUpdate = (state) => {
    // const mainState = state[0];
    // const mainPath = mainState.path;
    // updatePath(mainState, mainPath);
    socket.emit("create_file", { newStructure: state, room: state[0].name });
  };

  useEffect(() => {
    let incept = 0;
    socket.on("create_file", (data) => {
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
    } catch (err) {}
  }, [fileStructure]);
  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2'>File Explorer</h2>
      <Tree data={data} onUpdate={handleUpdate} onNodeClick={handleClick} />
    </div>
  );
};

export default FileStructure;
