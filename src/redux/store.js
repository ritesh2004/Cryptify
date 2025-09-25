import { combineReducers, configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/LoginSlice';
import { persistStore,persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dbReducer from './slices/dbSlice';

const persistConfig = {
    key : 'root',
    storage : AsyncStorage,
    whitelist : ['login','db']
}

const rootReducer = combineReducers({
    login : loginReducer,
    db : dbReducer,
})

const persistedReducer = persistReducer(persistConfig,rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
})

// Add this function to clear persisted storage if needed
export const clearPersistedStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Storage cleared successfully');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

export const persistor = persistStore(store);

export default store;