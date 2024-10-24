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
import SubTasks from "../src/Components/Subpage/Tasks/SubTasks";
import ActivityTypes from "./Pages/Settings/ActivityTypes";
import Taxes from "./Pages/Settings/Taxes";
import Settings from "./Pages/Settings/Settings";

//subpages
import SimpleTabs from "./Components/Subpage/SimpleTabs";
import GoogleCallback from "./Pages/GoogleCallback";
import CalendarPage from "./Pages/Calendar";

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
      const lastPath = localStorage.getItem("lastPath");

      if (isAuthenticated) {
        if (lastPath && lastPath !== "/login") {
          navigate(lastPath);
        } else {
          navigate("/dashboard");
        }
      } else if (location.pathname !== "/login") {
        localStorage.setItem("lastPath", location.pathname);
      }
    }
  }, [isLoading, isAuthenticated]);

  return (
    <div className="flex h-full w-full border border-gray-100">
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
                <Route path="/reports" element={<Reports />} />
                <Route path="/users" element={<Users />} />
                <Route path="/archived-users" element={<ArchivedUsers />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/activity-logs" element={<ActivityLogs />} />
                <Route path="/events" element={<Events />} />
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
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setLoggedInUser(user);
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
