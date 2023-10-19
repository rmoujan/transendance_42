import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <div>
          <Home />
        </div>
      </BrowserRouter>
    </ReduxProvider>
  );
}

export default App;
