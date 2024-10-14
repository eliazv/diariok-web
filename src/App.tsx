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
    <div className="app">
      <h1>My Diary</h1>
      {!user ? (
        <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <div className="notes">
            {notes.map((note) => (
              <div key={note.id} className="note">
                <p>
                  <strong>{note.date}</strong>
                </p>
                <p>{note.content}</p>
              </div>
            ))}
          </div>
          <div className="new-note">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a new note..."
            />
            <button onClick={handleAddNote}>Add Note</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
