import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { server } from "./main";
import { ProtectedRoute } from "protected-route-react";

// Components
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";

// Pages
import Dashboard from "./Pages/Dashboard";
import Departments from "./Pages/Departments";
import Clients from "./Pages/Clients";
import Projects from "./Pages/Projects";
import Tasks from "./Pages/Tasks";
import Reports from "./Pages/Reports";
import Users from "./Pages/Users";
import ArchivedUsers from "./Pages/ArchivedUsers";
import Roles from "./Pages/Roles";
import Sales from "./Pages/Sales";
import ActivityLogs from "./Pages/ActivityLogs";
import Events from "./Pages/Events";
import Team from "./Pages/Team";
import Trash from "./Pages/Trash";
import Login from "./Login/login";
import Tags from "./Pages/Settings/Tags";
import Status from "./Components/Subpage/Tasks/Status";
import ActivityTypes from "./Pages/Settings/ActivityTypes";
import Taxes from "./Pages/Settings/Taxes";
import Settings from "./Pages/Settings/Settings";

// Subpages
import SimpleTabs from "./Components/Subpage/SimpleTabs";
import GoogleCallback from "./Pages/GoogleCallback";
import CalendarPage from "./Pages/Calendar";
import UserDetails from "./Pages/UserDetails";
import TicketForm from "./Pages/Ticket/TicketForm";
import TicketList from "./Pages/Ticket/Tickets";
import TicketHistory from "./Pages/Ticket/TicketHistory";
import Leads from "./Pages/Leads";
import LeadTask from "./Pages/LeadTask";
import Leaves from "./Pages/Leave/Leaves";
import LeaveForm from "./Pages/Leave/LeaveForm";
import LeaveHistory from "./Pages/Leave/LeaveHistory";
import { loadUserRedux } from "./redux/actions/user";
import { useDispatch } from "react-redux";
import Notes from "./Pages/Notes/Notes";
import NoteForm from "./Pages/Notes/NoteForm";

const AppContent = ({
  isAuthenticated,
  isLoading,
  loggedInUser,
  handleLogin,
  handleLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        const lastPath = localStorage.getItem("lastPath");

        if (lastPath && lastPath !== "/login" && lastPath !== "/") {
          navigate(lastPath);
        } else if (loggedInUser?.role?.name === "User") {
          navigate("/tasks");
        } else if (loggedInUser?.role?.name === "Telecaller") {
          navigate("/sales");
        } else if (loggedInUser?.role?.name == "Client") {
          navigate("/projects");
        } else {
          navigate("/dashboard");
        }
      } else if (location.pathname !== "/login") {
        localStorage.setItem("lastPath", location.pathname);
      }
    }
  }, [isLoading, isAuthenticated]);

  return (
    <div className="flex h-full w-full border border-gray-100 overflow-x-hidden">
      {isAuthenticated && loggedInUser && <Sidebar user={loggedInUser} />}
      <div className="flex flex-col flex-1">
        {isAuthenticated && (
          <Navbar user={loggedInUser} onLogout={handleLogout} />
        )}
        <div className="flex-1 p-5 bg-white">
          <Routes>
            <Route
              path="/login"
              element={
                <ProtectedRoute
                  isAuthenticated={!isAuthenticated}
                  redirect="/dashboard"
                >
                  <Login onLogin={handleLogin} />
                </ProtectedRoute>
              }
            />
            {isAuthenticated ? (
              <>
                <Route
                  path="/auth/google/callback"
                  element={<GoogleCallback onLogin={handleLogin} />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/calendar" element={<CalendarPage />} />
                {/* <Route path="/reports" element={<Reports />} /> */}

                {loggedInUser.role.name === "Admin" ||
                  loggedInUser.role.name === "Manager" ? (
                  <Route path="/tickets" element={<TicketList />} />
                ) : (
                  <Route path="/tickets" element={<TicketForm />} />
                )}

                <Route path="/ticket-history" element={<TicketHistory />} />

                {loggedInUser.role.name === "Admin" ||
                  loggedInUser.role.name === "Manager" || loggedInUser.role.name === "Client" ? (
                  <Route path="/notes" element={<Notes />} />
                ) : (
                  <Route path="/notes" element={<NoteForm />} />
                )}

                {loggedInUser.role.name === "Admin" ||
                  loggedInUser.role.name === "Manager" ? (
                  <Route path="/leaves" element={<Leaves />} />
                ) : (
                  <Route path="/leaves" element={<LeaveForm />} />
                )}

                <Route path="/leave-history" element={<LeaveHistory />} />

                <Route path="/users" element={<Users />} />
                <Route path="/user/:userId" element={<UserDetails />} />
                <Route path="/archived-users" element={<ArchivedUsers />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/leads" element={<Leads />} />

                {loggedInUser.role.name === "Admin" ||
                  loggedInUser.role.name === "Manager" ? (
                  <Route path="/sales" element={<Sales />} />
                ) : (
                  <Route path="/sales" element={<LeadTask />} />
                )}

                <Route path="/activity-logs" element={<ActivityLogs />} />
                {/* <Route path="/events" element={<Events />} /> */}
                <Route path="/team" element={<Team />} />
                <Route path="/trashed" element={<Trash />} />
                <Route path="/tasks-data" element={<Tasks />} />
                <Route path="/tasks/status" element={<Status />} />
                <Route path="/tags" element={<Tags />} />
                <Route path="/activity-types" element={<ActivityTypes />} />
                <Route path="/taxes" element={<Taxes />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/simpletab" element={<SimpleTabs />} />
              </>
            ) : (
              <Route
                path="*"
                element={
                  <Navigate to="/login" replace state={{ from: location }} />
                }
              />
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  async function fetchVapidPublicKey() {
    try {
      const response = await axios.get(`${server}/auth/getVapidPublicKey`);
      if (response.data.success) {
        return response.data.publicKey;
      } else {
        console.error("Failed to fetch VAPID public key");
      }
    } catch (error) {
      console.error("Error fetching VAPID public key:", error);
    }
  }

  async function subscribeUser() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const publicKey = await fetchVapidPublicKey();

        if (!publicKey) {
          console.error("No VAPID public key available");
          return;
        }

        const registration = await navigator.serviceWorker.register("/sw.js");
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        const token = localStorage.getItem("authToken");
        await axios.post(
          `${server}/auth/subscribe`,
          { subscription },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              withCredentials: true,
            },
          }
        );

        console.log("User is subscribed for push notifications");
      } catch (error) {
        console.error("Failed to subscribe the user:", error);
      }
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const loadUser = async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        setIsLoading(true);
        const response = await axios.get(`${server}/auth/getMyProfile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setIsAuthenticated(true);
        setLoggedInUser(response.data.user);
        setIsLoading(false);
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setLoggedInUser(null);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadUser();
    dispatch(loadUserRedux());
  }, [dispatch]);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setLoggedInUser(user);
    subscribeUser();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("lastPath");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        loggedInUser={loggedInUser}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </Router>
  );
};

export default App;
