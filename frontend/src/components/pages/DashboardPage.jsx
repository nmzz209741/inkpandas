import { useState } from "react";
import { Box, Paper, Button, TextField, Alert } from "@mui/material";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeleteArticle, useGetMyArticles } from "../../hooks/useArticles";
import { useAuthContext } from "../../hooks/useAuthContext";

import LoadingSpinner from "../common/LoadingSpinner";
import ErrorLoading from "../common/ErrorLoading";
import PageHeading from "../common/PageHeading";
import MyArticlesTable from "../views/MyArticlesTable";
import { stripHtml } from "../../utils/contentUtils";

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    fontWeight: "bold",
  },
  searchContainer: {
    marginLeft: 4,
    width: "100%",
  },
  tableContainer: {
    marginTop: 5,
    height: "60vh",
    overflow: "auto",
  },

  loadMore: {
    display: "flex",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 2,
  },
};

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [pageToken, setPageToken] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const navigate = useNavigate();
  const { user } = useAuthContext();

  const { data, isLoading, error, isFetchingNextPage } =
    useGetMyArticles(pageToken);
  const deleteArticleMutation = useDeleteArticle();

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortArticles = (articles) => {
    return [...articles].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "updatedAt": {
          const aTime = a.updatedAt
            ? new Date(a.updatedAt).getTime()
            : new Date(a.createdAt).getTime();
          const bTime = b.updatedAt
            ? new Date(b.updatedAt).getTime()
            : new Date(b.createdAt).getTime();
          comparison = aTime - bTime;
          break;
        }
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const filteredArticles =
    data?.articles.filter(
      (article) =>
        article.userId === user?.id &&
        (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stripHtml(article.content)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    ) || [];

  const sortedArticles = sortArticles(filteredArticles);

  const handleLoadMore = () => {
    if (data?.nextPage) {
      setPageToken(data.nextPage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticleMutation.mutateAsync(id);
        navigate('/articles')
      } catch (error) {
        console.error("Failed to delete article:", error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading articles: {error.message}
        </Alert>
        <ErrorLoading />
      </>
    );
  }

  return (
    <>
      <PageHeading heading="My Articles" />
      <Box sx={styles.header}>
        <Button
          sx={styles.button}
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => navigate("/articles/new")}
        >
          New Article
        </Button>
        <Paper sx={styles.searchContainer}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search your articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8 }} />,
            }}
          />
        </Paper>
      </Box>
      <Box sx={styles.tableContainer}>
        <MyArticlesTable
          sortField={sortField}
          sortOrder={sortOrder}
          sortedArticles={sortedArticles}
          navigate={navigate}
          handleSort={handleSort}
          handleDelete={handleDelete}
        />
      </Box>
      {data?.nextPage && (
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

export default DashboardPage;
