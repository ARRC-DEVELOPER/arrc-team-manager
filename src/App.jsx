import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";

// Pages
import Dashboard from "./Pages/Dashboard";
import Departments from "./Pages/Departments";
import Clients from "./Pages/Clients";
import Projects from "./Pages/Projects";
import Tasks from "./Pages/Tasks";
import Calendar from "./Pages/Calendar";
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
// import Tasks from "./Pages/Tasks";

import ActivityTypes from "./Pages/Settings/ActivityTypes";
import Taxes from "./Pages/Settings/Taxes";
import Settings from "./Pages/Settings/Settings";

//subpages
import SimpleTabs from "./Components/Subpage/SimpleTabs";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
  };

  return (
    <Router>
      <div className="flex h-full w-full border border-gray-100">
        {isAuthenticated && loggedInUser && <Sidebar user={loggedInUser} />}
        <div className="flex flex-col flex-1">
          {isAuthenticated && (
            <Navbar user={loggedInUser} onLogout={handleLogout} />
          )}
          <div className="flex-1 p-5 bg-white">
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              {isAuthenticated ? (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/calendar" element={<Calendar />} />
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

                  <Route path="/activity-logs" element={<ActivityLogs />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/trashed" element={<Trash />} />

                  <Route path="/simpletab" element={<SimpleTabs />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
