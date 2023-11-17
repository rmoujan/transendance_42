import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
    <ReduxProvider store={store}>
        <App />
    </ReduxProvider>
     </React.StrictMode>
);
