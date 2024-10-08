import { configureStore } from '@reduxjs/toolkit';

import playerReducer from './features/playerSlice';
import { coreAPI } from './services/coreAPI';

export const store = configureStore({
  reducer: {
    [coreAPI.reducerPath]: coreAPI.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(coreAPI.middleware),
});
