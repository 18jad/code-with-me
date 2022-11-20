import { useLayoutEffect, useReducer } from "react";
import { ThemeProvider } from "styled-components";
import { v4 } from "uuid";

import { reducer, TreeContext } from "./state";
import { useDidMountEffect } from "./utils";

import { File } from "./File/TreeFile";
import { Folder } from "./Folder/TreeFolder";
import { StyledTree } from "./Tree.style";

const Tree = ({ children, data, onNodeClick, onUpdate }) => {
  const [state, dispatch] = useReducer(reducer, data);

  useLayoutEffect(() => {
    dispatch({ type: "SET_DATA", payload: data });
  }, [data]);

  useDidMountEffect(() => {
    onUpdate && onUpdate(state);
  }, [state]);

  const isImparative = data && !children;

  return (
    <ThemeProvider theme={{ indent: 20 }}>
      <TreeContext.Provider
        value={{
          isImparative,
          state,
          dispatch,
          onNodeClick: (node) => {
            onNodeClick && onNodeClick(node);
          },
        }}>
        <StyledTree>
          {isImparative ? (
            <TreeRecusive data={state} parentNode={state} />
          ) : (
            children
          )}
        </StyledTree>
      </TreeContext.Provider>
    </ThemeProvider>
  );
};

const TreeRecusive = ({ data, parentNode }) => {
  return data.map((item, i) => {
    console.log(data[i]);
    // TODO: FIX UPDATE DELETE FILE ERROR
    if (!parentNode) {
      item = Object.assign({}, item, { parentNode: data });
      // data[i] = item;
    } else {
      item = Object.assign({}, item, { parentNode });
      // data[i] = item;
    }
    if (!item.id) {
      item = Object.assign({}, item, { id: v4() });
      // data[i] = item;
    }

    if (item.type === "file") {
      return (
        <File
          key={item.id}
          id={item.id}
          name={item.name}
          node={item}
          path={item.path}
        />
      );
    }
    if (item.type === "folder") {
      return (
        <Folder key={item.id} id={item.id} name={item.name} node={item}>
          <TreeRecusive parentNode={item} data={item.files} />
        </Folder>
      );
    }
    return null;
  });
};

Tree.File = File;
Tree.Folder = Folder;

export default Tree;
