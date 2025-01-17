import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

import { useGetArticle } from "../../hooks/useArticles";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import { Edit, ArrowLeft } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorLoading from "../common/ErrorLoading";
import { formatDate } from "../../utils/dateUtils";
import PageHeading from "../common/PageHeading";

const styles = {
  container: {
    maxWidth: 800,
    py: 4,
  },
  header: {
    mb: 4,
  },
  backButton: {
    mb: 2,
    display: "flex",
    alignItems: "center",
    gap: 1,
    color: "text.secondary",
    textDecoration: "none",
    "&:hover": {
      color: "primary.main",
    },
  },
  titleSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    mb: 2,
  },
  metadata: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    color: "text.secondary",
    mb: 3,
  },
  content: {
    p: 4,
  },
  htmlContent: {
    "& .ql-editor": {
      padding: 0,
      "& p": {
        marginBottom: 2,
      },
      "& h1, & h2, & h3": {
        marginTop: 3,
        marginBottom: 2,
      },
    },
  },
  plainContent: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
  },
  divider: {
    my: 3,
  },
};

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { data: article, isLoading, error } = useGetArticle(id);
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <>
        <ErrorLoading />
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading article: {error.message}
        </Alert>
      </>
    );
  }

  if (!article) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Article not found
      </Alert>
    );
  }

  const isAuthor = user?.id === article.userId;

  const formattedDate = formatDate(article.createdAt);
  const formattedUpdateDate = article.updatedAt
    ? formatDate(article.updatedAt)
    : null;


  return (
    <Container sx={styles.container}>
      <Box sx={styles.header}>
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}
          sx={styles.backButton}
        >
          Back
        </Button>

        <Box sx={styles.titleSection}>
          <PageHeading heading={article.title} />
          {isAuthor && (
            <Tooltip title="Edit Article">
              <IconButton
                onClick={() => navigate(`/articles/${article.id}/edit`)}
                color="primary"
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box sx={styles.metadata}>
          <Chip
            label={`Published on ${formattedDate}`}
            variant="outlined"
            size="small"
          />
          {formattedUpdateDate && (
            <Chip
              label={`Updated on ${formattedUpdateDate}`}
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      </Box>

      <Divider sx={styles.divider} />

      <Paper sx={styles.content}>
        {
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={styles.htmlContent}
          />
        }
      </Paper>
    </Container>
  );
};

export default ArticleDetailPage;
