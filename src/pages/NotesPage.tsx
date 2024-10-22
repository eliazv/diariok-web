import React, { useState, useEffect, useRef } from "react";
import { Note } from "../types/Note";
import {
  Typography,
  TextField,
  IconButton,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
      if (editingNote) {
        const noteDocRef = doc(db, "notes", editingNote.id);
        await updateDoc(noteDocRef, {
          content: newNote,
        });
        setEditingNote(null);
      } else {
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
      }
      setNewNote("");
    }
  };

  const handleEditNote = (note: Note) => {
    setNewNote(note.content);
    setEditingNote(note);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setNewNote("");
  };

  const handleDeleteNote = async () => {
    if (noteToDelete) {
      await deleteDoc(doc(db, "notes", noteToDelete.id));
      setNoteToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const openDeleteConfirm = (note: Note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const closeDeleteConfirm = () => {
    setNoteToDelete(null);
    setDeleteDialogOpen(false);
  };

  const getDateReference = () => {
    if (editingNote) {
      return `Modificando la nota del ${formatDate(editingNote.date)}`;
    }
    return `Creando nota del ${formatDate(new Date().toLocaleDateString())}`;
  };

  const formatDate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split("/").map(Number);
    const monthNames = [
      "gen",
      "feb",
      "mar",
      "apr",
      "mag",
      "giu",
      "lug",
      "ago",
      "set",
      "ott",
      "nov",
      "dic",
    ];
    return `${day} ${monthNames[month - 1]} ${year}`;
  };

  return (
    <>
      <Box className="notes-container">
        {notes.map((note) => (
          <Paper key={note.id} className="note" ref={lastNoteRef}>
            <Typography className="note-date">
              {formatDate(note.date)}
            </Typography>

            <div className="icon-container">
              <IconButton
                className="edit-icon"
                onClick={() => handleEditNote(note)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                className="delete-icon"
                onClick={() => openDeleteConfirm(note)}
              >
                <DeleteIcon />
              </IconButton>
            </div>

            <ReactMarkdown className="note-text">{note.content}</ReactMarkdown>
          </Paper>
        ))}
      </Box>

      <div className="new-note-container">
        <div className="note-header">
          <Typography className="note-reference">
            {getDateReference()}
          </Typography>

          {editingNote && (
            <IconButton onClick={handleCancelEdit} className="cancel-button">
              <CancelIcon />
            </IconButton>
          )}
        </div>

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
          onClick={handleAddNote}
          className="send-button"
          disabled={!newNote.trim()}
        >
          <SendIcon />
        </IconButton>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteConfirm}
        className="dialog-dark-theme"
      >
        <DialogTitle>Confermi l'eliminazione della nota?</DialogTitle>
        <DialogActions>
          <Button onClick={closeDeleteConfirm} color="primary">
            Annulla
          </Button>
          <Button onClick={handleDeleteNote} color="secondary">
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default NotesPage;
