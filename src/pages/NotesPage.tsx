import React, { useState, useEffect, useRef } from "react";
import { Note } from "../types/Note";
import { Typography, TextField, IconButton, Paper, Box } from "@mui/material";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const lastNoteRef = useRef<HTMLDivElement | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const notesRef = collection(db, "notes");
      const q = query(notesRef, where("userId", "==", user.uid));
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
  }, [user]);

  useEffect(() => {
    if (lastNoteRef.current) {
      lastNoteRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [notes]);

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

  const handleDeleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNote(note.content);
  };

  const handleUpdateNote = async () => {
    if (editingNote) {
      const noteDocRef = doc(db, "notes", editingNote.id);
      await updateDoc(noteDocRef, {
        content: newNote,
      });
      setEditingNote(null);
      setNewNote("");
    }
  };

  const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Box className="notes-container">
        {notes.map((note) => (
          <Paper key={note.id} className="note" ref={lastNoteRef}>
            <Typography className="note-date">
              {formatDate(note.date)}
            </Typography>
            <ReactMarkdown className="note-text">{note.content}</ReactMarkdown>
            <IconButton onClick={() => handleEditNote(note)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteNote(note.id)}>
              <DeleteIcon />
            </IconButton>
          </Paper>
        ))}
      </Box>
      <div className="new-note-container">
        <TextField
          multiline
          minRows={2}
          maxRows={10}
          variant="outlined"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
          className="new-note-input"
        />
        <IconButton
          onClick={editingNote ? handleUpdateNote : handleAddNote}
          className="send-button"
          disabled={!newNote.trim()}
        >
          <SendIcon />
        </IconButton>
      </div>
    </>
  );
};

export default NotesPage;
