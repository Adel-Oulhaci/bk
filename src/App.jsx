import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Layout from "./components/shared/Layout";
import Home from "./pages/Home";
import Inscription from "./pages/Inscription";
import About from "./pages/About";
import Event from "./pages/Event";
import History from "./pages/History";
import Team from "./pages/Team";
import AdminLayout from "./admin/components/AdminLayout";
import AddAnInscription from "./admin/components/AddAnInscription";
import ListOfEvents from "./admin/components/ListOfEvents";
import AdminPage from "./admin/AdminPage";
import AddAnEvent from "./admin/components/AddAnEvent";
import Login from "./pages/Login";
import UpdateAnEvent from "./admin/components/UpdateAnEvent";
import AddMember from "./admin/components/AddMember";
import UpdateMember from "./admin/components/UpdateMember";
import { EventsProvider } from "./context/EventsContext";

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-bk"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <EventsProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="event" element={<Event />} />
            <Route path="history" element={<History />} />
            <Route path="team" element={<Team />} />
            <Route path="inscription/:eventId" element={<Inscription />} />
          </Route>
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminPage />} />
            <Route path="addaninscription" element={<AddAnInscription />} />
            <Route path="listofevents" element={<ListOfEvents />} />
            <Route path="addanevent" element={<AddAnEvent />} />
            <Route path="updateanevent" element={<UpdateAnEvent />} />
            <Route path="addmember" element={<AddMember />} />
            <Route path="updatemember" element={<UpdateMember />} />
          </Route>
        </Routes>
      </Router>
    </EventsProvider>
  );
}

export default App;
