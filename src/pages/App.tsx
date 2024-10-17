import React, { useState, useEffect, useRef } from "react";
import "../styles/App.scss";

import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { Container, Typography, Paper, Box } from "@mui/material";
import DiaryDrawer from "../components/DiaryDrawer";
import ReactMarkdown from "react-markdown";
import Login from "../components/Login";
import { Note } from "../types/Note";
import NotesPage from "./NotesPage";
import SettingsPage from "./SettingsPage";
import StatisticsPage from "./StatisticPage";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [selectedPage, setSelectedPage] = useState<string>("note");
  const lastNoteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        const notesRef = collection(db, "notes");
        const q = query(notesRef, where("userId", "==", currentUser.uid));
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const notesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            content: doc.data().content as string,
            date: doc.data().date as string,
          }));

          const parseDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split("/").map(Number);
            return new Date(year, month - 1, day);
          };

          const sortedNotes = notesData.sort(
            (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
          );
          setNotes(sortedNotes);
        });
        return () => unsubscribeSnapshot();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (lastNoteRef.current) {
      lastNoteRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [notes]);

  const handleCloseModal = () => {
    setDrawerOpen(false);
  };
  const handleOpenModal = () => {
    setDrawerOpen(true);
  };

  const handleAddNote = async () => {
    const today = new Date().toLocaleDateString();
    if (user) {
      const existingNote = notes.find((note) => note.date === today);

      if (existingNote) {
        const noteDocRef = doc(db, "notes", existingNote.id);
        await updateDoc(noteDocRef, {
          content: `${existingNote.content}\n\n${newNote}`,
        });
      } else {
        await addDoc(collection(db, "notes"), {
          content: newNote,
          date: today,
          userId: user.uid,
        });
      }
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

  const handleExportNotes = () => {
    const today = new Date().toLocaleDateString();
    const notesText = notes
      .map((note) => `${note.date}\n${note.content}`)
      .join("\n\n");
    const blob = new Blob([notesText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Diariok-notes-${today}.txt`;
    link.click();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      maxWidth="sm"
      className={`app ${isDrawerOpen ? "drawer-open" : ""}`}
    >
      {!user ? (
        <Login handleLogin={handleLogin} />
      ) : (
        <>
          <DiaryDrawer
            open={isDrawerOpen}
            onOpen={handleOpenModal}
            onClose={handleCloseModal}
            handleLogout={handleLogout}
            handleExportNotes={handleExportNotes}
            selectedPage={selectedPage}
            onSelectPage={setSelectedPage}
          />
          {selectedPage === "note" && (
            <Box className="notes-container">
              {notes.map((note) => (
                <Paper key={note.id} className="note">
                  <Typography className="note-date">{note.date}</Typography>
                  <ReactMarkdown className="note-text">
                    {note.content}
                  </ReactMarkdown>
                </Paper>
              ))}
            </Box>
          )}
          {selectedPage === "statistiche" && <StatisticsPage />}
          {selectedPage === "impostazioni" && <SettingsPage />}
          {selectedPage === "note" && (
            <NotesPage
              notes={notes}
              newNote={newNote}
              setNewNote={setNewNote}
              handleAddNote={handleAddNote}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default App;
