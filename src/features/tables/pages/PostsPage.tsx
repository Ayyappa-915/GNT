/* ============================================================
   POSTS PAGE
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

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";
const PAGE_SIZE = 25;

/* ============================================================
   POSTS PAGE COMPONENT
============================================================ */

const PostsPage = () => {

  const dispatch = useAppDispatch();

  const { currentPage, cachedPages } = useAppSelector(
    (state: RootState) => state.tables.posts
  );

  const [totalPages, setTotalPages] = useState(0);

  const pageData = cachedPages[currentPage];

  /* ============================================================
     FETCH PAGE DATA FROM API
  ============================================================ */

  const fetchPageData = async (pageIndex: number) => {

    try {

      const response = await axios.get(BASE_URL, {
        params: {
          _page: pageIndex + 1,
          _limit: PAGE_SIZE
        }
      });

      const records = response.data;

      /* --------------------------------------------------------
         Get total records from response header
      -------------------------------------------------------- */

      const totalRecords = Number(response.headers["x-total-count"]);

      setTotalPages(Math.ceil(totalRecords / PAGE_SIZE));

      /* --------------------------------------------------------
         Transform API response
      -------------------------------------------------------- */

      const pageData: Post[] = records.map((item: any) => ({
        id: item.id,
        title: item.title,
        body: item.body
      }));

      /* --------------------------------------------------------
         Cache page in Redux
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
     STRICT MODE GUARD
  ============================================================ */

  const fetchedRef = React.useRef(false);

  useEffect(() => {

    if (!fetchedRef.current && !pageData) {

      fetchedRef.current = true;

      fetchPageData(currentPage);

    }

  }, [currentPage, pageData]);

  /* ============================================================
     NEXT PAGE
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
     PREVIOUS PAGE
  ============================================================ */

 const handlePrevious = async () => {

  const prevPage = currentPage - 1;

  if (prevPage < 0) return;

  if (!cachedPages[prevPage]) {
    await fetchPageData(prevPage);
  }

  dispatch(
    setPage({
      table: "posts",
      page: prevPage
    })
  );

};

  /* ============================================================
     PAGE NUMBER CLICK
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
     RENDER TABLE
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
