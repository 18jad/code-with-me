import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project: {
    allowedUser: [],
    title: "",
    description: "",
    id: "",
    fileStructure: [
      {
        type: "folder",
        name: "project",
        path: "/projects/project",
        files: [],
      },
    ],
  },
  link: "",
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload.project;
      state.link = action.payload.link;
    },
  },
});

export const { setProject } = projectSlice.actions;

export default projectSlice.reducer;
