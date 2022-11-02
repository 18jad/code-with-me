import { useLayoutEffect, useState } from "react";
import Tree from "./FileTree/Tree";

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

export default FileStructure;