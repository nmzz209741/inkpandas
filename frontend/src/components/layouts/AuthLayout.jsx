import { Box, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

import logo from "../../assets/images/bgLogo.png";

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(45deg, #059f48 30%, #034620 90%)",
  },
  main: {
    flex: "1 0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  logo: {
    width: "100%",
    maxWidth: "400px",
    height: "auto",
  },
  gridContainer: {
    width: "100%",
    maxWidth: "1200px",
    alignItems: "center",
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
};

export default function AuthLayout() {
  return (
    <Box sx={styles.root}>
      <Navbar />
      <Box component="main" sx={styles.main}>
        <Grid
          container
          spacing={2}
          sx={styles.gridContainer}
          direction={{ xs: "column", sm: "column", md: "row" }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <RouterLink to="/" style={styles.logo}>
              <img src={logo} alt="Logo" style={styles.logo} />
            </RouterLink>
          </Grid>

          <Grid item xs={12} md={6} sx={styles.formContainer}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
}
