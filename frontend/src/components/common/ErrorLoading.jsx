import { Box, Button, Typography } from "@mui/material";

const styles = {
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    height: "80vh"
  },
};

const ErrorLoading = () => {
  return (
    <Box sx={styles.errorContainer}>
      <Typography variant="h6">Oops!!! Something went wrong</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.reload()}
      >
        Try again
      </Button>
    </Box>
  );
};

export default ErrorLoading;
