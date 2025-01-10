import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import logo from "../../assets/images/bgLogo.png";
import MobileNav from "./MobileNav";

const styles = {
  appBar: (isAuthPage) => ({
    background: isAuthPage ? "transparent" : "primary.main",
    boxShadow: isAuthPage ? "none" : undefined,
  }),
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    textDecoration: "none",
    color: "inherit",
    marginRight: { xs: 1, md: 4 },
  },
  logoImage: {
    width: 160,
    height: 80,
    objectFit: "contain",
  },
  spacer: {
    flexGrow: 1,
  },
  button: (isAuthPage) => ({
    color: "inherit",
    fontWeight: "bold",
    ...(isAuthPage && {
      borderColor: "white",
      border: "1px solid",
      ml: 1,
      "&:hover": {
        borderColor: "white",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
    }),
  }),
  desktopNav: {
    display: { xs: "none", md: "flex" },
  },
  mobileNav: {
    display: { xs: "flex", md: "none" },
  },
};

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isAuthPage =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register");

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const navItems = [
    { to: "/", text: "Home" },
    { to: "/articles", text: "Articles" },
    { to: "/about", text: "About" },
    ...(user ? [{ to: "/dashboard", text: "Dashboard" }] : []),
  ];

  const authNavItems = isAuthPage
    ? [
        { to: "/articles", text: "Articles" },
        { to: "/about", text: "About" },
      ]
    : [
        { to: "/login", text: "Login" },
        { to: "/register", text: "Register" },
      ];

  return (
    <AppBar position="static" sx={styles.appBar(isAuthPage)}>
      <Toolbar>
        {!isAuthPage && isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileMenuOpen(true)}
            sx={styles.mobileNav}
          >
            <MenuIcon />
          </IconButton>
        )}

        <RouterLink to="/" style={styles.logo}>
          <img src={logo} alt="Logo" style={styles.logoImage} />
        </RouterLink>

        {!isAuthPage && (
          <Box sx={styles.desktopNav}>
            {navItems.map((item, index) => (
              <NavBarItem key={index} to={item.to} text={item.text} />
            ))}
          </Box>
        )}

        <Box sx={styles.spacer} />

        {isAuthPage ? (
          <Box>
            <NavBarItem to="/articles" text="Articles" isAuthPage />
            <NavBarItem to="/about" text="About" isAuthPage />
          </Box>
        ) : (
          <Box sx={styles.desktopNav}>
            {user ? (
              <Button
                color="inherit"
                component={RouterLink}
                onClick={handleLogout}
                to="/login"
              >
                Logout
              </Button>
            ) : (
              <>
                <NavBarItem to="/login" text="Login" />
                <NavBarItem to="/register" text="Register" />
              </>
            )}
          </Box>
        )}
      </Toolbar>
      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        authNavItems={authNavItems}
        navItems={navItems}
      />
    </AppBar>
  );
}

const NavBarItem = ({ text, to, isAuthPage }) => {
  return (
    <Button
      color="inherit"
      component={RouterLink}
      to={to}
      sx={styles.button(isAuthPage)}
    >
      {text}
    </Button>
  );
};
