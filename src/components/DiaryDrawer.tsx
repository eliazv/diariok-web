import { useEffect } from "react";
import {
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NoteIcon from "@mui/icons-material/Note";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SettingsIcon from "@mui/icons-material/Settings";

import "../styles/App.scss";

type DiaryDrawerProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  selectedPage: string;
  onSelectPage: (page: string) => void;
};

const DiaryDrawer = ({
  open,
  onOpen,
  onClose,
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

  const handleMenuItemClick = (page: string) => {
    onSelectPage(page);

    if (window.innerWidth < 1100) {
      onClose();
    }
  };

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
              className="menu-item"
              selected={selectedPage === "note"}
              onClick={() => handleMenuItemClick("note")}
            >
              <NoteIcon className="menu-icon" />
              <ListItemText primary="Note" />
            </ListItemButton>

            <ListItemButton
              className="menu-item"
              selected={selectedPage === "statistiche"}
              onClick={() => handleMenuItemClick("statistiche")}
            >
              <ShowChartIcon className="menu-icon" />
              <ListItemText primary="Statistiche" />
            </ListItemButton>

            <ListItemButton
              className="menu-item"
              selected={selectedPage === "impostazioni"}
              onClick={() => handleMenuItemClick("impostazioni")}
            >
              <SettingsIcon className="menu-icon" />
              <ListItemText primary="Impostazioni" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default DiaryDrawer;
