import React, { useRef, useEffect } from "react";
import { Note } from "../types/Note";
import { Typography, TextField, IconButton } from "@mui/material";
import ReactMarkdown from "react-markdown";
import SendIcon from "@mui/icons-material/Send";

interface NotesPageProps {
  notes: Note[];
  newNote: string;
  setNewNote: (value: string) => void;
  handleAddNote: () => void;
}

const NotesPage: React.FC<NotesPageProps> = ({
  notes,
  newNote,
  setNewNote,
  handleAddNote,
}) => {
  console.log("notes :", notes);
  const lastNoteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastNoteRef.current) {
      lastNoteRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [notes]);

  return (
    <>
      <div className="notes-container">
        {notes.map((note, index) => (
          <div
            key={note.id}
            className="note"
            ref={index === notes.length - 1 ? lastNoteRef : null}
          >
            <Typography className="note-date">{note.date}</Typography>
            <ReactMarkdown className="note-text">{note.content}</ReactMarkdown>
          </div>
        ))}
      </div>
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
          onClick={handleAddNote}
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
