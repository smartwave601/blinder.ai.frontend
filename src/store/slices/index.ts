import userReducer from '@app/store/slices/userSlice';
import authReducer from '@app/store/slices/authSlice';
import nightModeReducer from '@app/store/slices/nightModeSlice';
import themeReducer from '@app/store/slices/themeSlice';
import pwaReducer from '@app/store/slices/pwaSlice';
import searchReducer from '@app/store/slices/searchSlice';

export default {
  user: userReducer,
  auth: authReducer,
  nightMode: nightModeReducer,
  theme: themeReducer,
  pwa: pwaReducer,
  search: searchReducer,
};
