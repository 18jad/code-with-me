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
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload.project;
    },
  },
});

export const { setProject } = projectSlice.actions;

export default projectSlice.reducer;
