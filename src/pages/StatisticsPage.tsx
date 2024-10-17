import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Note } from "../types/Note";

const StatisticsPage: React.FC = () => {
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

  const calculateStatistics = (notes: Note[]) => {
    const uniqueDays = new Set(notes.map((note) => note.date));
    const totalWords = notes.reduce((sum, note) => {
      const wordCount = note.content.trim().split(/\s+/).length;
      return sum + wordCount;
    }, 0);

    return {
      daysWithNotes: uniqueDays.size,
      totalWords: totalWords,
    };
  };

  return (
    <div className="page-container">
      <h3>Statistiche</h3>
      {/* giorni, parole, emoji */}
      <p>Giorni diversi con note: {calculateStatistics(notes).daysWithNotes}</p>
      <p>Numero totale di parole: {calculateStatistics(notes).totalWords}</p>
    </div>
  );
};

export default StatisticsPage;
