import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store/store.ts";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.jikan.moe/v4/top/characters",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ApolloProvider client={client}> */}
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    {/* </ApolloProvider> */}
  </React.StrictMode>
);
