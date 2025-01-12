import { useAuthContext } from "../../hooks/useAuthContext";
import AuthForm from "../views/AuthForm";

const RegisterPage = () => {
  const { register, error } = useAuthContext();

  return (
    <AuthForm
      title="Sign up"
      authFunction={register}
      authError={error}
      link={{ to: "/signin", text: "Already have an account? Sign in" }}
    />
  );
};

export default RegisterPage;
