import "./style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { LoginRegister } from "./pages/LoginRegister";
import { Study } from "./pages/Study";
import { Profile } from "./pages/Profile";
import { Store } from "./pages/Store";
import { Friends } from "./pages/Friends";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/study" element={<Study />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/store" element={<Store />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
    </Router>
  );

}
