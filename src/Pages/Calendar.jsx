import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";
import { server } from "../main";
import axios from "axios";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// GOOGLE-CALENDAR-CREDENTIALS
const CLIENT_ID =
  "754064810433-0g9rg29rpu2ehscbv8rpk9n24btaj81u.apps.googleusercontent.com";
const API_KEY = "AIzaSyB9zYqEDLQel7ppdieQyjMr_F4F3lVprTQ";
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

const LoginButton = () => {
  const redirectToGoogleAuth = () => {
    window.location.href = `${server}/auth/google`;
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={redirectToGoogleAuth}
    >
      Login with Google
    </button>
  );
};

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
        scope: SCOPES,
      });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  const handleLoginSuccess = async (response) => {
    const { credential } = response;

    console.log("Google Access Token:", credential);
    localStorage.setItem("googleAccessToken", credential);

    const authtoken = localStorage.getItem("authToken");

    // Send access token to your backend to store
    await axios.post(
      `${server}/users/save-google-token`,
      {
        googleAccessToken: credential,
      },
      {
        headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      }
    );

    gapi.client.setToken({ access_token: credential });
    await gapi.auth2.getAuthInstance().signIn();
    loadCalendarEvents();
    setIsAuthenticated(true);
  };

  const loadCalendarEvents = async () => {
    const events = await gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    });

    const googleEvents = events.result.items.map((event) => ({
      title: event.summary,
      start: new Date(event.start.dateTime || event.start.date),
      end: new Date(event.end.dateTime || event.end.date),
    }));

    setEvents(googleEvents);
  };

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700">
            Google Calendar
          </h1>
          <LoginButton />
        </div>

        {!isAuthenticated ? (
          <GoogleOAuthProvider clientId={CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Login Failed")}
              render={(renderProps) => (
                <button
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Sign in with Google
                </button>
              )}
            />
          </GoogleOAuthProvider>
        ) : (
          <>
            <button
              onClick={loadCalendarEvents}
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mb-6"
            >
              Load Calendar Events
            </button>

            <div className="overflow-hidden">
              <div className="h-[600px]">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  className="bg-white shadow rounded p-4"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
