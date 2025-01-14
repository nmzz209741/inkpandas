import { useState } from "react";
import { useGetArticles } from "../../hooks/useArticles";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorLoading from "../common/ErrorLoading";
import { Box, Button } from "@mui/material";
import PageHeading from "../common/PageHeading";
import ArticlesList from "../views/ArticlesList";
import EmptyContainer from "../common/EmptyContainer";

const styles = {
  searchBar: {
    marginBottom: 4,
  },

  loadMore: {
    display: "flex",
    justifyContent: "center",
    marginTop: 4,
  },
};
const ArticlesListPage = () => {
  const [pageToken, setPageToken] = useState(null);

  const { data, isLoading, error, isFetchingNextPage } =
    useGetArticles(pageToken);

  const { nextPage, articles } = data;

  const handleLoadMore = () => {
    if (nextPage) {
      setPageToken(nextPage);
    }
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorLoading />;
  }

  if (!articles.length) {
    return <EmptyContainer contentType="articles" />;
  }

  return (
    <>
      <PageHeading heading="articles" />
      <ArticlesList
        articles={articles}
        nextPage={nextPage}
        handleLoadMore={handleLoadMore}
        isFetchingNextPage={isFetchingNextPage}
      />
      {nextPage && (
        <Box sx={styles.loadMore}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default ArticlesListPage;
