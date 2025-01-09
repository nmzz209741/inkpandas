import { createBrowserRouter } from "react-router-dom";
import BaseLayout from "../components/layouts/BaseLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
  },
]);

export default router;
