import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Home from "./pages/Home";
import Inscription from "./pages/Inscription";
import About from "./pages/About";
import Event from "./pages/Event";
import History from "./pages/History";
import AdminPanel from "./pages/AdminPanel";
// import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="event" element={<Event />} />
          <Route path="history" element={<History />} />
          <Route path="inscription/:eventId" element={<Inscription />} />
          <Route path="admin" element={<AdminPanel />} />
          {/* <Route path="login" element={<Login />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;