/* ============================================================
   USERS PAGE
   - Handles pagination logic for users
   - Caches page data in Redux
   - Connects Users data to GenericTable
============================================================ */

import React, { useEffect } from "react";
import usersData from "../data/users.json";
import GenericTable from "../components/GenericTable/GenericTable";
import { userColumns } from "../configs/users.columns";
import { User } from "../interfaces/users.interface";

import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { setPage, cachePageData } from "../redux/tablesSlice";
import { RootState } from "../../../app/store";

/* ============================================================
   CONFIGURATION CONSTANTS
============================================================ */

// Number of records per page
const PAGE_SIZE = 25;

/* ============================================================
   USERS PAGE COMPONENT
============================================================ */

const UsersPage = () => {

  /* ============================================================
     REDUX SETUP
     - Access dispatch function
     - Select pagination and cache state
  ============================================================ */

  const dispatch = useAppDispatch();

  const { currentPage, cachedPages } = useAppSelector(
    (state: RootState) => state.tables.users
  );

  /* ============================================================
     DERIVED VALUES
     - Calculate total pages dynamically
  ============================================================ */

  const totalPages = Math.ceil(usersData.length / PAGE_SIZE);

  /* ============================================================
     INITIAL DATA LOAD
     - Loads only first page (Page 0)
     - Prevents duplicate caching
  ============================================================ */

  useEffect(() => {
    const isFirstPageCached = cachedPages[0];

    if (!isFirstPageCached) {
      dispatch(
        cachePageData({
          table: "users",
          page: 0,
          data: usersData.slice(0, PAGE_SIZE),
        })
      );
    }
  }, [cachedPages, dispatch]);

  /* ============================================================
     HANDLE NEXT PAGE
     - Loads next page if not cached
     - Updates current page in Redux
  ============================================================ */

  const handleNext = () => {
    const nextPageIndex = currentPage + 1;

    if (nextPageIndex >= totalPages) return;

    const isNextPageCached = cachedPages[nextPageIndex];

    if (!isNextPageCached) {
      const startIndex = nextPageIndex * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;

      dispatch(
        cachePageData({
          table: "users",
          page: nextPageIndex,
          data: usersData.slice(startIndex, endIndex),
        })
      );
    }

    dispatch(setPage({ table: "users", page: nextPageIndex }));
  };

  /* ============================================================
     HANDLE PREVIOUS PAGE
     - Moves back one page safely
  ============================================================ */

  const handlePrevious = () => {
    if (currentPage === 0) return;

    dispatch(
      setPage({
        table: "users",
        page: currentPage - 1,
      })
    );
  };

  /* ============================================================
     HANDLE DIRECT PAGE CHANGE (Smart Pagination)
     - Only allows navigation to cached pages
  ============================================================ */

  const handlePageChange = (pageIndex: number) => {
    const isPageCached = cachedPages[pageIndex];

    if (isPageCached) {
      dispatch(setPage({ table: "users", page: pageIndex }));
    }
  };

  /* ============================================================
     COMPONENT RENDER
  ============================================================ */

  return (
    <GenericTable<User>
      data={cachedPages[currentPage] || []}
      columns={userColumns}
      currentPage={currentPage}
      totalPages={totalPages}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onPageChange={handlePageChange}
      cachedPages={cachedPages}
      actions={{
        onView: (row) => console.log("View User:", row),
        onEdit: (row) => console.log("Edit User:", row),
        onDelete: (row) => console.log("Delete User:", row),
      }}
    />
  );
};

export default UsersPage;