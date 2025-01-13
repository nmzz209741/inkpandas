import { Box, Typography } from "@mui/material";
const styles = {
  header: {
    width: "inherit",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    textTransform: "capitalize",
  },
};
const PageHeading = ({ heading }) => {
  return (
    <Box sx={styles.header}>
      <Typography variant="h4" component="h1">
        {heading}
      </Typography>
    </Box>
  );
};

export default PageHeading;
