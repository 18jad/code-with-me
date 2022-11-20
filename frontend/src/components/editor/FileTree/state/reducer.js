import _cloneDeep from "lodash.clonedeep";
import { EditorController } from "views/Editor/editorController";
import { createFile, createFolder, searchDFS } from "../utils";
import { FILE, FOLDER } from "./constants";

const editorController = new EditorController();

const reducer = (state, action) => {
  let newState = _cloneDeep(state);
  let node = null;
  let parent = null;
  if (action.payload && action.payload.id) {
    let foundNode = searchDFS({
      data: newState,
      cond: (item) => {
        console.log(item, action.payload.id);
        return item.id === action.payload.id;
      },
    });
    // TODO: HANDLE FILE RENAME DELETE ERROR
    console.log(foundNode);

    node = foundNode.item;
    console.log(node);
    parent = node.parentNode;
  }

  switch (action.type) {
    case "SET_DATA":
      return action.payload;

    case FILE.CREATE:
      node.files.push(
        createFile({
          name: action.payload.name,
        }),
      );
      let ustate = newState[0];

      editorController
        .createFile(node.name, action.payload.name)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      editorController
        .updateProjectStructure(node.name, JSON.stringify(ustate))
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));

      return newState;

    case FOLDER.CREATE:
      node.files.push(
        createFolder({ name: action.payload.name, path: action.payload.path }),
      );
      return newState;

    case FOLDER.EDIT:
    case FILE.EDIT:
      node.name = action.payload.name;
      return newState;

    case FOLDER.DELETE:
    case FILE.DELETE:
      if (!parent || Array.isArray(parent)) {
        newState = newState.filter((file) => file.id !== action.payload.id);
        return newState;
      } else {
        parent.files = parent.files.filter(
          (file) => file.id !== action.payload.id,
        );
      }
      return newState;

    default:
      return state;
  }
};

export { reducer };
