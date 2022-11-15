import { configureStore } from "@reduxjs/toolkit";
import Cookies from "cookies-js";
import { persistReducer, persistStore } from "redux-persist";
import { CookieStorage } from "redux-persist-cookie-storage";
import thunk from "redux-thunk";
import loginReducer from "./slices/loginSlice";

Cookies.defaults = {
  secure: true, // available only over SSL
  expires: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const persistConfig = {
  key: "user",
  storage: new CookieStorage(Cookies),
};

const persistedReducer = persistReducer(persistConfig, loginReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
