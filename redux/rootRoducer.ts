import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import appReducer from './slices/App';

// ----------------------------------------------------------------------

const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    //here we want to persist all of things thats why below array are blank
    //   whitelist: [],
    //   blacklist: [],
};

const rootReducer = combineReducers({
    app: appReducer,
});

export { rootPersistConfig, rootReducer };
