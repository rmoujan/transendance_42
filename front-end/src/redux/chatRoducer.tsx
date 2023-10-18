import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";


const rootPresistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  // whitelist: ['settings'],
  // blacklist: [],
};

const chatReducer = combineReducers({
//   app: appReducer,
//   conversation: conversationReducer,
});

export { rootPresistConfig, chatReducer };
