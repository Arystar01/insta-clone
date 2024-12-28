import { configureStore } from '@reduxjs/toolkit';
import authSlice from './AuthSlice'; // Make sure the path is correct
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Define persist config
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// Combine your reducers (if you have more than one slice, you can add them here)
const rootReducer = combineReducers({
  auth: authSlice,
});

// Apply persistence to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with persistence
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
