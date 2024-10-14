import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
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
  Button,
  TextField,
  Paper,
  Box,
} from "@mui/material";

interface Note {
  id: string;
  content: string;
  date: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

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
    <Container maxWidth="sm" sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Diary
      </Typography>
      {!user ? (
        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{ mb: 3, backgroundColor: "#a84d97" }}
        >
          Login with Google
        </Button>
      ) : (
        <>
          <Button variant="outlined" onClick={handleLogout} sx={{ mb: 3 }}>
            Logout
          </Button>
          <Box sx={{ mb: 4 }}>
            {notes.map((note) => (
              <Paper
                key={note.id}
                sx={{ p: 2, mb: 2, backgroundColor: "#f0f0f0" }}
              >
                <Typography variant="body2" color="textSecondary">
                  {note.date}
                </Typography>
                <Typography variant="body1">{note.content}</Typography>
              </Paper>
            ))}
          </Box>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              multiline
              rows={4}
              variant="outlined"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a new note..."
            />
            <Button
              variant="contained"
              onClick={handleAddNote}
              sx={{ backgroundColor: "#a84d97" }}
            >
              Add Note
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default App;
