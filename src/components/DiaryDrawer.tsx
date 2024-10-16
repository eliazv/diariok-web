import { useEffect } from "react";
import {
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import "../styles/App.scss";

type DiaryDrawerProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  handleLogout: () => void;
};

const DiaryDrawer = ({
  open,
  onOpen,
  onClose,
  handleLogout,
}: DiaryDrawerProps) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1100 && open) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open, onClose]);

  return (
    <div className="diarydrawer">
      {!open && (
        <IconButton onClick={onOpen} className="open-drawer-icon">
          <MenuIcon />
        </IconButton>
      )}

      <Drawer anchor="left" open={open} onClose={onClose} variant="persistent">
        <Box role="presentation" className="drawer-content">
          <List>
            <ListItem>
              <ListItemText className="title" primary="Diariok" />
              <IconButton className="close-btn" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </ListItem>
            <ListItem component="button">
              <ListItemText primary="Calendario" />
            </ListItem>
            <ListItem component="button">
              <ListItemText primary="Statistiche" />
            </ListItem>
            <ListItem component="button">
              <ListItemText primary="Impostazioni" />
            </ListItem>
            <ListItem component="button">
              <ListItemText primary="Esci" />
              <IconButton className="logout-button" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default DiaryDrawer;
