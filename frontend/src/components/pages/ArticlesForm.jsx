import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateArticle,
  useGetArticle,
  useUpdateArticle,
} from "../../hooks/useArticles";
import { useForm, Controller } from "react-hook-form";
import { Box, TextField, Button, Paper, Alert, Container } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";
import { useEffect, useRef } from "react";
import PageHeading from "../common/PageHeading";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useQueryClient } from "@tanstack/react-query";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "blockquote", "code-block"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "blockquote",
  "code-block",
  "align",
  "color",
  "background",
];

const styles = {
  container: {
    maxWidth: "75%",
    mx: "auto",
    py: 4,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    mb: 4,
  },
  backButton: {
    color: "text.secondary",
    "&:hover": {
      color: "primary.main",
    },
  },
  paper: {
    p: 4,
    borderRadius: 2,
    boxShadow: (theme) => theme.shadows[3],
    display: "flex",
    flexDirection: "column",
    minHeight: "60vh",
    bgcolor: "background.paper",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    flex: 1,
  },
  titleField: {
    "& .MuiOutlinedInput-root": {
      fontSize: "1.25rem",
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.12)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 0, 0, 0.24)",
      },
    },
  },
  editorContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    borderRadius: 1,
    overflow: "hidden",
    "& .quill": {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      "& .ql-toolbar": {
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      },
      "& .ql-container": {
        flex: 1,
        overflow: "auto",
        border: "none",
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      "& .ql-editor": {
        minHeight: "30vh",
        padding: 3,
        "&:focus": {
          outline: "none",
        },
      },
    },
  },
  buttons: {
    display: "flex",
    gap: 2,
    justifyContent: "flex-end",
    mt: 4,
    pb: 2,
  },
  errorText: {
    color: "error.main",
    mt: 1,
    fontSize: "0.75rem",
    fontWeight: 500,
  },
};

export default function ArticlesForm() {
  const { id } = useParams();
  const { data: article, isLoading: isLoadingArticle } = useGetArticle(
    id || ""
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const quillRef = useRef(null);

  const {
    register,
    control,
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

  useEffect(() => {
    queryClient.invalidateQueries(["articles"]);
    queryClient.invalidateQueries(["myArticles"]);
  }, [navigate, queryClient]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode && id) {
        await updateArticleMutation.mutateAsync({ id, data });

        navigate(`/articles/${id}`);
      } else {
        await createArticleMutation.mutateAsync(data);

        navigate("/dashboard");
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
    <Container sx={styles.container}>
      <Button
        startIcon={<ArrowLeft />}
        onClick={() => navigate(-1)}
        sx={styles.backButton}
      >
        Back
      </Button>
      <PageHeading
        heading={isEditMode ? "Edit Article" : "Create New Article"}
      />

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.message}
        </Alert>
      )}

      <Paper sx={styles.paper}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={styles.form}
        >
          <TextField
            label="Title"
            placeholder="Enter article title..."
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={styles.titleField}
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
          />

          <Box sx={styles.editorContainer}>
            <Controller
              name="content"
              control={control}
              defaultValue=""
              rules={{
                required: "Content is required",
                minLength: {
                  value: 10,
                  message: "Content must be at least 10 characters",
                },
              }}
              render={({ field }) => (
                <Box sx={{ flex: 1 }}>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your article content here..."
                    {...field}
                  />
                  {errors.content && (
                    <Box sx={styles.errorText}>{errors.content.message}</Box>
                  )}
                </Box>
              )}
            />
          </Box>

          <Box sx={styles.buttons}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isEditMode ? "Update" : "Create"} Article
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
