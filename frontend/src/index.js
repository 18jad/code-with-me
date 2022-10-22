import App from "App";
import "index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <React.Suspense
        fallback={<div className='text-white text-2xl'>Loading...</div>}>
        <App />
      </React.Suspense>
    </React.StrictMode>
  </BrowserRouter>,
);
