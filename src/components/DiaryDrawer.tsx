import { useState } from "react";
import "../styles/App.scss";

import {
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type DiaryDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const DiaryDrawer = ({ open, onClose }: DiaryDrawerProps) => {
  const [isDrawerOpen, setDrawerOpen] = useState(true);
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box role="presentation" className="drawer-content">
        <IconButton onClick={toggleDrawer}>
          <CloseIcon />
        </IconButton>
        <List>
          <ListItem component="button">
            <ListItemText primary="Note del giorno" />
          </ListItem>

          <ListItem component="button">
            <ListItemText primary="Impostazioni" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default DiaryDrawer;
