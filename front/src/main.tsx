import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ReduxProvider store={store}>
        <App />
    </ReduxProvider>
);
