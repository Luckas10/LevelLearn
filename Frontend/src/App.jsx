import "./style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { LoginRegister } from "./pages/LoginRegister";
import { Study } from "./pages/Study";
import { StudyFlashCards } from "./pages/StudyFlashCards";
import { StudyPomodore } from "./pages/StudyPomodore";
import { CollectionSelected } from "./pages/CollectionSelected";
import { Profile } from "./pages/Profile";
import { Store } from "./pages/Store";
import { Friends } from "./pages/Friends";
import { BattleFlashCards } from "./pages/BattleFlashCards";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* 🔓 Rota pública */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginRegister />} />
        </Route>

        {/* 🔒 Grupo de rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/flashcards" element={<StudyFlashCards />} />
          <Route path="/study/pomodore" element={<StudyPomodore />} />
          <Route path="/study/flashcards/selected/:id" element={<CollectionSelected />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/store" element={<Store />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/battleflashcards" element={<BattleFlashCards />} />
        </Route>
      </Routes>
    </Router>
  );
}
