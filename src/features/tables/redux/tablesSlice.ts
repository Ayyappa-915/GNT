/* ============================================================
   TABLES REDUX SLICE
   - Stores pagination state for all tables
   - Maintains current page per table
   - Caches page data to avoid refetching
============================================================ */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TableState, TablesState } from "./tables.types";

/* ============================================================
   HELPER: CREATE INITIAL TABLE STATE
============================================================ */

const createInitialTableState = (): TableState<any> => ({
  currentPage: 0,
  cachedPages: {},
});

/* ============================================================
   ROOT INITIAL STATE
============================================================ */

const initialState: TablesState = {
  albums: createInitialTableState(),
  users: createInitialTableState(),
  posts: createInitialTableState(),
  comments: createInitialTableState(),
};

/* ============================================================
   SLICE
============================================================ */

const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {

    setPage: (
      state,
      action: PayloadAction<{ table: keyof TablesState; page: number }>
    ) => {
      const { table, page } = action.payload;
      state[table].currentPage = page;
    },

    cachePageData: (
      state,
      action: PayloadAction<{
        table: keyof TablesState;
        page: number;
        data: any[];
      }>
    ) => {
      const { table, page, data } = action.payload;
      state[table].cachedPages[page] = data;
    },

  },
});

export const { setPage, cachePageData } = tablesSlice.actions;
export default tablesSlice.reducer;