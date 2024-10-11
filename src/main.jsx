import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store.js";

// export const server = "http://localhost:2000/api/v1";

// Production URL
// export const server = "http://127.0.0.1:5000/api";

// Deployement URL
export const server = "https://arrc-team-manager-server.onrender.com/api";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
  // </React.StrictMode>
);
