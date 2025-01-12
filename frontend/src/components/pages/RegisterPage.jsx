import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from "@mui/material";
import { useAuthContext } from "../../hooks/useAuthContext";

const styles = {
  authContainer: {
    padding: 4,
    alignItems: "center",
    width: "50vh",
    background: "secondary.main",
    maxHeight: { lg: "75vh", md: "75vh" },
    // margin: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  submitButton: {
    marginTop: "1rem",
  },
  signupLink: {
    marginTop: "1.5rem",
    textAlign: "center",
  },
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { register: signup, error } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    try {
      await signup(data);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      
    }
  };

  return (
    <Paper elevation={2} sx={styles.authContainer}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={styles.form}
        noValidate
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          required
          fullWidth
          label="Email Address"
          autoComplete="email"
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />

        <TextField
          required
          fullWidth
          label="Password"
          type="password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={styles.submitButton}
        >
          Sign Up
        </Button>

        <Box sx={styles.signupLink}>
          <Link component={RouterLink} to="/signin" variant="body2">
            Already have an account? Sign in
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default RegisterPage;
