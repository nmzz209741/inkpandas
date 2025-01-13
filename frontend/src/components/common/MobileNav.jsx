import {
  Drawer,
  List,
  Divider,
  Box,
  IconButton,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { X } from "lucide-react";

const styles = {
  drawer: {
    "& .MuiDrawer-paper": {
      width: "80%",
      maxWidth: 300,
    },
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    p: 1,
  },
  listItem: {
    borderRadius: 1,
    mx: 1,
    my: 0.5,
  },
};

function MobileNavItem({ to, text, onClick, secondaryText }) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        component={RouterLink}
        to={to}
        onClick={onClick}
        sx={styles.listItem}
      >
        <ListItemText
          primary={text}
          secondary={secondaryText}
          secondaryTypographyProps={{
            variant: "caption",
            sx: { opacity: 0.7 },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function MobileNav({
  open,
  onClose,
  navItems,
  authNavItems,
  user,
  onLogout,
}) {
  const handleItemClick = () => {
    onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose} sx={styles.drawer}>
      <Box sx={styles.header}>
        <IconButton onClick={onClose}>
          <X />
        </IconButton>
      </Box>
      <Divider />

      <List>
        {navItems.map((item, index) => (
          <MobileNavItem
            key={index}
            to={item.to}
            text={item.text}
            onClick={handleItemClick}
          />
        ))}
      </List>

      {user ? (
        <>
          <Divider sx={{ my: 1 }} />
          <List>
            <MobileNavItem
              to="/signin"
              text="Logout"
              onClick={() => {
                onLogout();
                handleItemClick();
              }}
              secondaryText={user.email}
            />
          </List>
        </>
      ) : (
        <>
          <Divider sx={{ my: 1 }} />
          <List>
            {authNavItems.map((item, index) => (
              <MobileNavItem
                key={index}
                to={item.to}
                text={item.text}
                onClick={handleItemClick}
              />
            ))}
          </List>
        </>
      )}
    </Drawer>
  );
}
