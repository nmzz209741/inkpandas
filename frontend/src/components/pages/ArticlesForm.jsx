import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateArticle,
  useGetArticle,
  useUpdateArticle,
} from "../../hooks/useArticles";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import LoadingSpinner from "../common/LoadingSpinner";
import { useEffect } from "react";

const styles = {
  paper: {
    padding: 4,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  buttons: {
    display: "flex",
    gap: 2,
    marginTop: 2,
  },
};

const ArticlesForm = () => {
  const { id } = useParams();
  const { data: article, isLoading: isLoadingArticle } = useGetArticle(id);
  const navigate = useNavigate();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        content: article.content,
      });
    }
  }, [article, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode && id) {
        await updateArticleMutation.mutateAsync({ id, data });
        navigate(`/articles/${id}`);
      } else {
        await createArticleMutation.mutateAsync(data);
        navigate(`/dashboard`);
      }
    } catch (error) {
      console.error("Failed to save article:", error);
    }
  };

  if (isEditMode && isLoadingArticle) {
    return <LoadingSpinner />;
  }

  const isError =
    createArticleMutation.isError || updateArticleMutation.isError;
  const error = createArticleMutation.error || updateArticleMutation.error;

  return (
    <Paper sx={styles.paper}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? "Edit Article" : "Create New Article"}
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={styles.form}>
        <TextField
          label="Title"
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          })}
        />

        <TextField
          label="Content"
          fullWidth
          multiline
          rows={8}
          error={!!errors.content}
          helperText={errors.content?.message}
          {...register("content", {
            required: "Content is required",
            minLength: {
              value: 10,
              message: "Content must be at least 10 characters",
            },
          })}
        />

        <Box sx={styles.buttons}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEditMode ? "Update" : "Create"} Article
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ArticlesForm;
