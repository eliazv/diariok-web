import { useEffect } from "react";
import {
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemButton,
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
  handleExportNotes: () => void;
  selectedPage: string;
  onSelectPage: (page: string) => void;
};

const DiaryDrawer = ({
  open,
  onOpen,
  onClose,
  handleLogout,
  handleExportNotes,
  selectedPage,
  onSelectPage,
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
            <ListItem divider>
              <ListItemText className="title" primary="Diariok" />
              <IconButton className="close-btn" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </ListItem>
            <ListItemButton
              selected={selectedPage === "note"}
              onClick={() => onSelectPage("note")}
            >
              <ListItemText primary="Note" />
            </ListItemButton>

            <ListItemButton
              selected={selectedPage === "statistiche"}
              onClick={() => onSelectPage("statistiche")}
            >
              <ListItemText primary="Statistiche" />
            </ListItemButton>

            <ListItemButton
              selected={selectedPage === "impostazioni"}
              onClick={() => onSelectPage("impostazioni")}
            >
              <ListItemText primary="Impostazioni" />
            </ListItemButton>
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
