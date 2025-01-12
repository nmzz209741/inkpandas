import { Box, IconButton } from "@mui/material";
import { SOCIAL_MEDIA } from "../../configs/constants";
import { useLocation } from "react-router-dom";

const styles = {
  footerContainer: (isAuthPage) => ({
    bgcolor: isAuthPage ? "secondary.main" : "primary.main",
    color: isAuthPage ? "primary.main" : "secondary.main",
    height: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 1,
  }),
};

const Footer = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname.includes("/signin") ||
    location.pathname.includes("/register");
  return (
    <Box component="footer" sx={styles.footerContainer(isAuthPage)}>
      {SOCIAL_MEDIA.map((social) => (
        <IconButton
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noreferrer"
          sx={{ color: "inherit", mx: 0.5 }}
          aria-label={social.name}
        >
          {social.icon}
        </IconButton>
      ))}
      <Box sx={{ flexGrow: 1 }}></Box>
      <p>
        &copy; {new Date().getFullYear()} @nmzz209741. Crafted with &#x2665;
      </p>
    </Box>
  );
};

export default Footer;
