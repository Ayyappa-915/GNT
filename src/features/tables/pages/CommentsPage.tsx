/* ============================================================
   COMMENTS PAGE
   - Handles pagination logic for comments
   - Caches page data in Redux
   - Connects Comments data to GenericTable
============================================================ */

import React, { useEffect } from "react";
import commentsData from "../data/comments.json";
import GenericTable from "../components/GenericTable/GenericTable";
import { commentColumns } from "../configs/comments.columns";
import { Comment } from "../interfaces/comments.interface";

import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { setPage, cachePageData } from "../redux/tablesSlice";
import { RootState } from "../../../app/store";

/* ============================================================
   CONFIGURATION CONSTANTS
============================================================ */

// Number of records per page
const PAGE_SIZE = 25;

/* ============================================================
   COMMENTS PAGE COMPONENT
============================================================ */

const CommentsPage = () => {

  /* ============================================================
     REDUX SETUP
     - Access dispatch function
     - Select pagination and cache state
  ============================================================ */

  const dispatch = useAppDispatch();

  const { currentPage, cachedPages } = useAppSelector(
    (state: RootState) => state.tables.comments
  );

  /* ============================================================
     DERIVED VALUES
     - Calculate total pages dynamically
  ============================================================ */

  const totalPages = Math.ceil(commentsData.length / PAGE_SIZE);

  /* ============================================================
     INITIAL DATA LOAD
     - Loads only first page (Page 0)
     - Avoids duplicate caching
  ============================================================ */

  useEffect(() => {
    const isFirstPageCached = cachedPages[0];

    if (!isFirstPageCached) {
      const startIndex = 0;
      const endIndex = PAGE_SIZE;

      dispatch(
        cachePageData({
          table: "comments",
          page: 0,
          data: commentsData.slice(startIndex, endIndex),
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
          table: "comments",
          page: nextPageIndex,
          data: commentsData.slice(startIndex, endIndex),
        })
      );
    }

    dispatch(setPage({ table: "comments", page: nextPageIndex }));
  };

  /* ============================================================
     HANDLE PREVIOUS PAGE
     - Moves back one page safely
  ============================================================ */

  const handlePrevious = () => {
    if (currentPage === 0) return;

    dispatch(
      setPage({
        table: "comments",
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
      dispatch(setPage({ table: "comments", page: pageIndex }));
    }
  };

  /* ============================================================
     COMPONENT RENDER
  ============================================================ */

  return (
    <GenericTable<Comment>
      data={cachedPages[currentPage] || []}
      columns={commentColumns}
      currentPage={currentPage}
      totalPages={totalPages}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onPageChange={handlePageChange}
      cachedPages={cachedPages}
      actions={{
        onView: (row) => console.log("View Comment:", row),
        onEdit: (row) => console.log("Edit Comment:", row),
        onDelete: (row) => console.log("Delete Comment:", row),
      }}
    />
  );
};

export default CommentsPage;