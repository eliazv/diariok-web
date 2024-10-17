import React, { useState, useEffect } from "react";
import "../styles/App.scss";

import { auth } from "../firebase";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { Container } from "@mui/material";
import DiaryDrawer from "../components/DiaryDrawer";
import Login from "../components/Login";
import NotesPage from "./NotesPage";
import SettingsPage from "./SettingsPage";
import StatisticsPage from "./StatisticsPage";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [selectedPage, setSelectedPage] = useState<string>("note");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleCloseModal = () => {
    setDrawerOpen(false);
  };
  const handleOpenModal = () => {
    setDrawerOpen(true);
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth);
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
            selectedPage={selectedPage}
            onSelectPage={setSelectedPage}
          />
          {selectedPage === "note" && <NotesPage />}
          {selectedPage === "statistiche" && <StatisticsPage />}
          {selectedPage === "impostazioni" && <SettingsPage />}
        </>
      )}
    </Container>
  );
};

export default App;
