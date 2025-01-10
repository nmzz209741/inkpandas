import { useState } from "react";
import { useGetArticles } from "../../hooks/useArticles";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorLoading from "../common/ErrorLoading";
import { Typography } from "@mui/material";

const ArticlesList = () => {
  const [pageToken, setPageToken] = useState(null);

  const { data, isLoading, error, isFetchingNextPage } =
    useGetArticles(pageToken);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorLoading />;
  }

  return data.articles.map((article) => (
    <Typography variant="title" key={article.id}>
      {article.title}
    </Typography>
  ));
};

export default ArticlesList;
