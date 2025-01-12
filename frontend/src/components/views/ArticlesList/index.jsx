import { Grid2 } from "@mui/material";
import ArticleCard from "./ArticleCard";

const ArticlesList = ({ articles }) => {
  return (
    <>
      <Grid2 container spacing={3}>
        {articles.map((article) => (
          <ArticleCard article={article} key={article.id} />
        ))}
      </Grid2>
    </>
  );
};

export default ArticlesList;
