import React, { useState, useEffect } from "react";
import "../styles/App.scss";

import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import {
  Container,
  Typography,
  IconButton,
  TextField,
  Paper,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import DiaryDrawer from "../components/DiaryDrawer";

interface Note {
  id: string;
  content: string;
  date: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const notesRef = collection(db, "notes");
        const q = query(notesRef, where("userId", "==", currentUser.uid));
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const notesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            content: doc.data().content as string,
            date: doc.data().date as string,
          }));
          setNotes(notesData);
        });
        return () => unsubscribeSnapshot();
      }
    });
    return unsubscribe;
  }, []);

  const handleCloseModal = () => {
    setDrawerOpen(false);
  };

  const handleAddNote = async () => {
    const today = new Date().toLocaleDateString();
    if (user) {
      await addDoc(collection(db, "notes"), {
        content: newNote,
        date: today,
        userId: user.uid,
      });
      setNewNote("");
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <Container maxWidth="sm" className="app">
      <Typography variant="h4" gutterBottom>
        Diariok
      </Typography>
      {!user ? (
        <button onClick={handleLogin} className="login-button">
          Login with Google
        </button>
      ) : (
        <>
          <IconButton className="logout-button" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
          <DiaryDrawer open={isDrawerOpen} onClose={handleCloseModal} />
          <Box className="notes-container">
            {notes.map((note) => (
              <Paper key={note.id} className="note">
                <Typography className="note-date">{note.date}</Typography>
                <Typography className="note-text">{note.content}</Typography>
              </Paper>
            ))}
          </Box>
          <Box className="new-note-container">
            <TextField
              multiline
              rows={2}
              variant="outlined"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a new note..."
              className="new-note-input"
            />
            <IconButton onClick={handleAddNote} className="send-button">
              <SendIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Container>
  );
};

export default App;
