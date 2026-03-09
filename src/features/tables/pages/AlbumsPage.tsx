/* ============================================================
   ALBUMS PAGE
   - Handles pagination logic
   - Caches page data in Redux
   - Connects Album data to GenericTable
============================================================ */

import React, { useEffect } from "react";
import albumsData from "../data/albums.json";
import GenericTable from "../components/GenericTable/GenericTable";
import { albumColumns } from "../configs/albums.columns";
import { Album } from "../interfaces/album.interface";

import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { setPage, cachePageData } from "../redux/tablesSlice";
import { RootState } from "../../../app/store";

/* ============================================================
   CONFIGURATION CONSTANTS
============================================================ */

// Number of records per page
const PAGE_SIZE = 25;

/* ============================================================
   ALBUMS PAGE COMPONENT
============================================================ */

const AlbumsPage = () => {

  /* ============================================================
     REDUX SETUP
     - Dispatch for triggering actions
     - Select pagination + cache state
  ============================================================ */

  const dispatch = useAppDispatch();

  const { currentPage, cachedPages } = useAppSelector(
    (state: RootState) => state.tables.albums
  );

  /* ============================================================
     DERIVED VALUES
     - Calculate total number of pages
  ============================================================ */

  const totalPages = Math.ceil(albumsData.length / PAGE_SIZE);

  /* ============================================================
     INITIAL DATA LOAD
     - Loads only first page (Page 0)
     - Prevents reloading if already cached
  ============================================================ */

  useEffect(() => {
    const isFirstPageCached = cachedPages[0];

    if (!isFirstPageCached) {
      dispatch(
        cachePageData({
          table: "albums",
          page: 0,
          data: albumsData.slice(0, PAGE_SIZE),
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
          table: "albums",
          page: nextPageIndex,
          data: albumsData.slice(startIndex, endIndex),
        })
      );
    }

    dispatch(setPage({ table: "albums", page: nextPageIndex }));
  };

  /* ============================================================
     HANDLE PREVIOUS PAGE
     - Moves back one page
  ============================================================ */

  const handlePrevious = () => {
    if (currentPage === 0) return;

    dispatch(
      setPage({
        table: "albums",
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
      dispatch(setPage({ table: "albums", page: pageIndex }));
    }
  };

  /* ============================================================
     COMPONENT RENDER
  ============================================================ */

  return (
    <GenericTable<Album>
      data={cachedPages[currentPage] || []}
      columns={albumColumns}
      currentPage={currentPage}
      totalPages={totalPages}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onPageChange={handlePageChange}
      cachedPages={cachedPages}
      actions={{
        onView: (row) => console.log("View Album:", row),
        onEdit: (row) => console.log("Edit Album:", row),
        onDelete: (row) => console.log("Delete Album:", row),
      }}
    />
  );
};

export default AlbumsPage;