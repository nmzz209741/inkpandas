import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    bgcolor: "secondary.main",
    color: "primary.main",
  },
  mainContainer: { flex: "1 0 auto", width: "100%", height: "100%" },
};

const BaseLayout = () => {
  return (
    <Box sx={styles.root}>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={styles.mainContainer}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default BaseLayout;
