import { createBrowserRouter } from "react-router-dom";
import BaseLayout from "../components/layouts/BaseLayout";
import ErrorLayout from "../components/layouts/ErrorLayout";
import HomePage from "../components/pages/HomePage";
import ArticlesList from "../components/pages/ArticlesList";
import AboutPage from "../components/pages/AboutPage";
import DashboardPage from "../components/pages/DashboardPage";
import ArticlesForm from "../components/pages/ArticlesForm";
import AuthLayout from "../components/layouts/AuthLayout";
import LoginPage from "../components/pages/LoginPage";
import RegisterPage from "../components/pages/RegisterPage";
import ProtectedRoute from "../components/common/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    errorElement: <ErrorLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "articles",
        element: <ArticlesList />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "articles/new",
        element: (
          <ProtectedRoute>
            <ArticlesForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "articles/:id/edit",

        element: (
          <ProtectedRoute>
            <ArticlesForm />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

export default router;