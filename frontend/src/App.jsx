import { RouterProvider } from "react-router-dom";
import router from "./services/router";
import { ThemeProvider } from "@emotion/react";
import theme from "./configs/theme";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthProvider";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
