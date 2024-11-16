import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Home from "./pages/Home";
import Inscription from "./pages/Inscription";
import About from "./pages/About";
import Event from "./pages/Event";
import History from "./pages/History";
import Team from "./pages/Team";
import AdminLayout from "./admin/components/AdminLayout";
import AddAnInscription from "./admin/components/AddAnInscription";
//import ListOfEvents from "./admin/components/ListOfEvents";
import AdminPage from "./admin/AdminPage";
import AddAnEvent from "./admin/components/AddAnEvent";
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
          <Route path="team" element={<Team />} />
          <Route path="inscription/:eventId" element={<Inscription />} />
          {/* <Route path="login" element={<Login />} /> */}
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="addaninscription" element={<AddAnInscription />} />
          {/* <Route path="listofevents" element={<ListOfEvents />} /> */}
          <Route path="addanevent" element={<AddAnEvent />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
