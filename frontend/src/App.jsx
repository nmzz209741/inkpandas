import { RouterProvider } from "react-router-dom";
import router from "./services/router";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import { CssBaseline } from "@mui/material";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
