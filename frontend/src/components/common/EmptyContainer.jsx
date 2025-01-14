import { Box, Button, Typography } from "@mui/material";

const styles = {
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    height: "80vh",
  },
};

const EmptyContainer = ({ contentType }) => {
  return (
    <Box sx={styles.errorContainer}>
      <Typography variant="h6">
        Oops!!! There are no {contentType} at the moment. Please check back
        later.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.replace("/")}
      >
        Take Me Home
      </Button>
    </Box>
  );
};

export default EmptyContainer;
