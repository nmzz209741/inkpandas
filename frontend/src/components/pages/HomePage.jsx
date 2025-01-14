import { Typography, Box, Grid, Button, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/bgLogo.png";
import { getAllArticles } from "../../api/articlesApi";
import ArticleCard from "../views/ArticleCard";

const styles = {
  hero: {
    background: "linear-gradient(135deg, #124227 0%, #09863f 100%)",
    color: "white",
    py: { xs: 8, md: 12 },
    mb: 8,
    position: "relative",
    overflow: "hidden",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background:
        'url("https://images.unsplash.com/photo-1516414447565-b14be0adf13e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.1,
      zIndex: 0,
    },
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    maxWidth: 800,
    mx: "auto",
    px: 3,
    textAlign: "center",
  },
  heroLogo: {
    width: { xs: 80, md: 120 },
    height: { xs: 80, md: 120 },
    objectFit: "contain",
    mb: 4,
  },
  articleSection: {
    mb: 8,
  },
  articleCard: {
    height: "100%",
    p: 3,
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: (theme) => theme.shadows[8],
      "& .articleOverlay": {
        opacity: 1,
      },
    },
  },
  articleContent: {
    mb: 2,
    flex: 1,
  },
  articleOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(25, 118, 210, 0.9), transparent)",
    padding: 2,
    opacity: 0,
    transition: "opacity 0.3s ease",
    textAlign: "center",
  },
};

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllArticles(null, 3);
        setArticles(data.articles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={styles.hero}>
        <Container>
          <Box sx={styles.heroContent}>
            <img src={logo} alt="Logo" style={styles.heroLogo} />
            <Typography variant="h2" gutterBottom fontWeight="bold">
              Share Your Stories
            </Typography>
            <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
              Join our community of writers and readers
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={() => navigate("/register")}
              sx={{
                px: 4,
                py: 1.5,
                m: 1,
                fontSize: "1.1rem",
                boxShadow: (theme) => theme.shadows[8],
              }}
            >
              Start Writing Today
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/articles")}
              sx={{
                px: 4,
                py: 1.5,
                m: 1,
                fontSize: "1.1rem",
              }}
            >
              Explore All Articles
            </Button>
          </Box>
        </Container>
      </Box>
      {articles && (
        <Container sx={styles.articleSection}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            fontWeight="bold"
            mb={4}
          >
            Latest Articles
          </Typography>
          <Grid container spacing={3}>
            {articles.map((article) => (
              <Grid item xs={12} md={4} key={article.id}>
                <ArticleCard article={article} key={article.id} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
}
