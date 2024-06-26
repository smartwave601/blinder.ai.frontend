import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { SearchData } from '@app/interfaces/interfaces';

export interface SearchConditionState {
  search: SearchData;
}

const initialState: SearchConditionState = {
  search: { keyword: '', type: 'search', userID: '' },
};

export const setKeyword = createAction<PrepareAction<SearchData>>('search/setKeyword', (newKeyword) => {
  return {
    payload: newKeyword,
  };
});

export const searchSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setKeyword, (state, action) => {
      state.search = action.payload;
    });
  },
});

export default searchSlice.reducer;
