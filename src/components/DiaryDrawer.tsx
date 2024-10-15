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
  return (
    <div className="diarydrawer">
      {!open && (
        <IconButton
          onClick={onOpen}
          className="open-drawer-icon"
          // sx={{
          //   position: "fixed",
          //   top: "20px",
          //   left: "20px",
          //   zIndex: 1300, // Assicurati che sia sopra il contenuto della pagina
          // }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer anchor="left" open={open} onClose={onClose} variant="persistent">
        <Box role="presentation" className="drawer-content">
          <List>
            <ListItem>
              <ListItemText className="title" primary="Diariok" />
              <IconButton onClick={onClose}>
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
              <ListItemText className="close-btn" primary="Esci" />
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
