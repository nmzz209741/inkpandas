import { RouterProvider } from "react-router-dom";
import router from "./services/router";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;