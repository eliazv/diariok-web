import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Note } from "../types/Note";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import LogoutIcon from "@mui/icons-material/Logout";

const SettingsPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = () => {
      const user = auth.currentUser;
      if (user) {
        const notesRef = collection(db, "notes");
        const q = query(notesRef, where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
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
        return () => unsubscribe();
      }
    };

    fetchNotes();
  }, []);

  const handleExportNotes = () => {
    const today = new Date().toLocaleDateString();

    const notesMarkdown = notes
      .map((note) => `# ${note.date}\n\n${note.content}`)
      .join("\n\n");

    const blob = new Blob([notesMarkdown], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Diariok-notes-${today}.md`;
    link.click();
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="page-container settingspage">
      <h3>Impostazioni</h3>
      <div className="user-info">
        <img
          src={auth.currentUser?.photoURL ?? "path/to/default/image.png"}
          alt="User Avatar"
          className="user-avatar"
        />
        <div className="user-texts">
          <p>{auth.currentUser?.displayName}</p>
          <p>{auth.currentUser?.email}</p>
        </div>
      </div>
      <div className="btn-wrapper">
        <Button
          onClick={handleExportNotes}
          variant="contained"
          startIcon={<DownloadIcon />}
        >
          Export Notes
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
