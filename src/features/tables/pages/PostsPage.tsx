/* ============================================================
   POSTS PAGE

   Responsibilities:
   - Fetch paginated data from API
   - Send limit + skip parameters to API
   - Cache fetched pages in Redux
   - Prevent duplicate API calls
   - Pass data + pagination handlers to GenericTable
============================================================ */

import React, { useEffect, useState } from "react";
import axios from "axios";

import GenericTable from "../components/GenericTable/GenericTable";
import { postColumns } from "../configs/posts.columns";
import { Post } from "../interfaces/posts.interface";

import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { setPage, cachePageData } from "../redux/tablesSlice";
import { RootState } from "../../../app/store";

/* ============================================================
   API CONFIGURATION
============================================================ */

const BASE_URL = "https://dummyjson.com/posts";
const PAGE_SIZE = 25;

/* ============================================================
   POSTS PAGE COMPONENT
============================================================ */

const PostsPage = () => {

  const dispatch = useAppDispatch();

  /* ============================================================
     REDUX STATE
     - currentPage : current page index
     - cachedPages : pages already fetched from API
  ============================================================ */

  const { currentPage, cachedPages } = useAppSelector(
    (state: RootState) => state.tables.posts
  );

  /* ============================================================
     LOCAL STATE
     - totalPages : total number of pages from API
  ============================================================ */

  const [totalPages, setTotalPages] = useState(0);

  /* ============================================================
     CURRENT PAGE DATA FROM CACHE
     Used to avoid unnecessary API calls
  ============================================================ */

  const pageData = cachedPages[currentPage];

  /* ============================================================
     FETCH PAGE DATA FROM API

     Responsibilities:
     - Calculate skip value
     - Call API with limit + skip
     - Transform API response
     - Store page data in Redux cache
  ============================================================ */

  const fetchPageData = async (pageIndex: number) => {

    try {

      const skip = pageIndex * PAGE_SIZE;

      const response = await axios.get(BASE_URL, {
        params: {
          limit: PAGE_SIZE,
          skip: skip
        }
      });

      const records = response.data.posts;
      const totalRecords = response.data.total;

      /* --------------------------------------------------------
         Calculate total pages
      -------------------------------------------------------- */

      setTotalPages(Math.ceil(totalRecords / PAGE_SIZE));

      /* --------------------------------------------------------
         Transform API data to table format
      -------------------------------------------------------- */

      const pageData: Post[] = records.map((item: any) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        tags: item.tags.join(", "),
      }));

      /* --------------------------------------------------------
         Store fetched page in Redux cache
      -------------------------------------------------------- */

      dispatch(
        cachePageData({
          table: "posts",
          page: pageIndex,
          data: pageData
        })
      );

    } catch (error) {

      console.error("API Error:", error);

    }

  };

  /* ============================================================
   PREVENT DUPLICATE API CALLS (STRICT MODE GUARD)

   React 18 StrictMode runs useEffect twice in development:
   - First mount → useEffect runs
   - React test cycle → useEffect runs again

   This can cause the API to be called twice.

   To prevent this, we use useRef as a flag.

   Why useRef?
   - Stores a persistent value across renders
   - Updating ref does NOT trigger re-render
   - Allows us to track if API was already called

   fetchedRef.current acts like a boolean guard:
   false → API not called yet
   true  → API already called
============================================================ */

const fetchedRef = React.useRef(false);


/* ============================================================
   LOAD DATA WHEN PAGE CHANGES

   Logic:
   - Check if page data already exists in Redux cache
   - Ensure API is not already triggered using fetchedRef
   - Call API only once
   - After calling API, set fetchedRef to true
     so StrictMode second run does not call API again
============================================================ */

useEffect(() => {

  if (!fetchedRef.current && !pageData) {

    /* --------------------------------------------------------
       Mark API as triggered
       This prevents duplicate calls during StrictMode rerun
    -------------------------------------------------------- */

    fetchedRef.current = true;

    /* --------------------------------------------------------
       Fetch page data from API
    -------------------------------------------------------- */

    fetchPageData(currentPage);

  }

}, [currentPage, pageData ]);

  /* ============================================================
     NEXT PAGE HANDLER
     - Move to next page
     - Fetch data if not cached
  ============================================================ */

  const handleNext = async () => {

    const nextPage = currentPage + 1;

    if (nextPage >= totalPages) return;

    if (!cachedPages[nextPage]) {
      await fetchPageData(nextPage);
    }

    dispatch(
      setPage({
        table: "posts",
        page: nextPage
      })
    );

  };

  /* ============================================================
     PREVIOUS PAGE HANDLER
  ============================================================ */

  const handlePrevious = () => {

    if (currentPage === 0) return;

    dispatch(
      setPage({
        table: "posts",
        page: currentPage - 1
      })
    );

  };

  /* ============================================================
     PAGE NUMBER CLICK HANDLER

     - Used for already fetched pages
     - Fetch API only if page not cached
  ============================================================ */

  const handlePageChange = async (pageIndex: number) => {

    if (!cachedPages[pageIndex]) {
      await fetchPageData(pageIndex);
    }

    dispatch(
      setPage({
        table: "posts",
        page: pageIndex
      })
    );

  };

  /* ============================================================
     RENDER GENERIC TABLE
  ============================================================ */

  return (

    <GenericTable<Post>
      data={pageData || []}
      columns={postColumns}
      currentPage={currentPage}
      totalPages={totalPages}
      cachedPages={cachedPages}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onPageChange={handlePageChange}
      actions={{
        onView: (row) => console.log("View:", row),
        onEdit: (row) => console.log("Edit:", row),
        onDelete: (row) => console.log("Delete:", row)
      }}
    />

  );

};

export default PostsPage;
