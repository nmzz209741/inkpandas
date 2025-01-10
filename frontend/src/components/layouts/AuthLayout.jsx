import { Container, Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
  },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    py: 4,
  },
  container: {
    width: "100%",
    maxWidth: 400,
  },
};

export default function AuthLayout() {
  return (
    <Box sx={styles.root}>
      <Navbar />
      <Box component="main" sx={styles.main}>
        <Container sx={styles.container}>
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
