import { useAuthContext } from "../../hooks/useAuthContext";
import AuthForm from "../views/AuthForm";

const LoginPage = () => {
  const { login, error } = useAuthContext();

  return (
    <AuthForm
      title="Sign in"
      authFunction={login}
      authError={error}
      link={{ to: "/register", text: "Don't have an account? Sign up" }}
    />
  );
};

export default LoginPage;
