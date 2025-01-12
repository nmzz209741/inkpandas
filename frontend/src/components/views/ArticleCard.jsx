import { Typography, Box, Chip, Paper, Grid2 } from "@mui/material";

const styles = {
  articleCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "27vh",
    padding: 3,
    transition: "transform 0.2s ease-in-out",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-4px)",
    },
  },
  title: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textTransform: "capitalize",
  },
  content: {
    fontSize: {
      xs: "0.875rem",
      sm: "1rem",
    },
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textTransform: "none",
  },
  articleMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  loadMore: {
    display: "flex",
    justifyContent: "center",
    marginTop: 4,
  },
  chip: {
    marginLeft: 1,
  },
};

const ArticleCard = ({ article }) => {
  return (
    <Grid2
      size={{
        lg: 3,
        md: 3,
        sm: 6,
        xs: 12,
      }}
    >
      <Paper elevation={2} sx={styles.articleCard}>
        <Typography variant="h6" gutterBottom sx={styles.title}>
          {article.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={styles.content}>
          {article.content}
        </Typography>
        <Box sx={styles.articleMeta}>
          <Typography variant="caption" color="text.secondary">
            {new Date(article.createdAt).toLocaleDateString()}
          </Typography>
          <Chip
            label="Read More"
            size="small"
            color="primary"
            variant="outlined"
            sx={styles.chip}
          />
        </Box>
      </Paper>
    </Grid2>
  );
};

export default ArticleCard;
