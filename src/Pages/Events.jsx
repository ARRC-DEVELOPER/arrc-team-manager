// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Import Ant Design icons

// const Events = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [viewType, setViewType] = useState('month'); // 'month' or 'week'
//   const [selectedMonth, setSelectedMonth] = useState('2024-10'); // Using YYYY-MM format for date picker
//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     startDate: '',
//     endDate: '',
//     type: '',
//     description: ''
//   });
//   const [events, setEvents] = useState([]);
//   const [editingEventId, setEditingEventId] = useState(null);

//   // Fetch events from the backend API
//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get('https://task-manager-backend-btas.onrender.com/api/events'); // Adjust URL if needed
//       setEvents(response.data);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewEvent((prevEvent) => ({
//       ...prevEvent,
//       [name]: value,
//     }));
//   };

//   const handleAddEvent = async () => {
//     try {
//       if (isEditing) {
//         await axios.put(`https://task-manager-backend-btas.onrender.com/api/events/${editingEventId}`, newEvent);
//       } else {
//         await axios.post('https://task-manager-backend-btas.onrender.com/api/events', newEvent);
//       }
//       resetForm();
//       fetchEvents();
//     } catch (error) {
//       console.error('Error adding/updating event:', error);
//     }
//   };

//   const handleEditEvent = (event) => {
//     setNewEvent({
//       title: event.title,
//       startDate: event.startDate,
//       endDate: event.endDate,
//       type: event.type,
//       description: event.description
//     });
//     setEditingEventId(event._id);
//     setIsEditing(true);
//     setShowPopup(true);
//   };

//   const handleDeleteEvent = async (id) => {
//     try {
//       await axios.delete(`https://task-manager-backend-btas.onrender.com/api/events/${id}`);
//       fetchEvents();
//     } catch (error) {
//       console.error('Error deleting event:', error);
//     }
//   };

//   const resetForm = () => {
//     setNewEvent({
//       title: '',
//       startDate: '',
//       endDate: '',
//       type: '',
//       description: ''
//     });
//     setEditingEventId(null);
//     setIsEditing(false);
//     setShowPopup(false);
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//   };

//   const handleViewToggle = (view) => {
//     setViewType(view);
//   };

//   const handleMonthNavigation = (direction) => {
//     const [year, month] = selectedMonth.split('-').map(Number);
//     let newYear = year;
//     let newMonth = month;

//     if (direction === 'prev') {
//       newMonth -= 1;
//       if (newMonth < 1) {
//         newMonth = 12;
//         newYear -= 1;
//       }
//     } else if (direction === 'next') {
//       newMonth += 1;
//       if (newMonth > 12) {
//         newMonth = 1;
//         newYear += 1;
//       }
//     }
//     const newDate = `${newYear}-${String(newMonth).padStart(2, '0')}`;
//     setSelectedMonth(newDate);
//   };

//   const renderCalendar = () => {
//     const numDays = new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1], 0).getDate(); // Get number of days in the month
//     const firstDay = new Date(selectedMonth + '-01').getDay(); // Get the first day of the month
//     const calendarDays = Array.from({ length: numDays }, (_, index) => index + 1); // Array of days in the month
  
//     if (viewType === 'month') {
//       return (
//         <div className="grid grid-cols-7 gap-4 text-center mb-6">
//           <div className="font-bold text-white bg-red-500 p-2">Sun</div>
//           <div className="font-bold text-white bg-blue-500 p-2">Mon</div>
//           <div className="font-bold text-white bg-blue-500 p-2">Tue</div>
//           <div className="font-bold text-white bg-blue-500 p-2">Wed</div>
//           <div className="font-bold text-white bg-blue-500 p-2">Thu</div>
//           <div className="font-bold text-white bg-blue-500 p-2">Fri</div>
//           <div className="font-bold text-white bg-blue-500 p-2">Sat</div>
//           {/* Empty slots for days before the first day of the month */}
//           {Array.from({ length: firstDay }).map((_, index) => (
//             <div key={index} className="border p-2 h-20"></div>
//           ))}
//           {calendarDays.map((day) => {
//             const dayEvents = events.filter(event => {
//               const eventStart = new Date(event.startDate);
//               const eventEnd = new Date(event.endDate);
//               // Check if the event is in the selected month and year
//               return (
//                 eventStart.getFullYear() === Number(selectedMonth.split('-')[0]) &&
//                 eventStart.getMonth() === Number(selectedMonth.split('-')[1]) - 1 && // Months are 0-indexed
//                 eventEnd.getFullYear() === Number(selectedMonth.split('-')[0]) &&
//                 eventEnd.getMonth() === Number(selectedMonth.split('-')[1]) - 1 &&
//                 (eventStart.getDate() <= day && eventEnd.getDate() >= day)
//               );
//             });
  
//             return (
//               <div
//                 key={day}
//                 className="border p-2 h-20 flex flex-col justify-center items-center"
//               >
//                 {day}
//                 {/* Display one div for the first event that spans this day */}
//                 {dayEvents.length > 0 && (
//                   <div className="text-xs text-gray-600 flex justify-between items-center w-full mt-1">
//                     <span>{dayEvents[0].title}</span> {/* Show only the first event title */}
//                     <div className='flex space-x-2'> {/* Add space between icons */}
//                       <button onClick={() => handleEditEvent(dayEvents[0])} className="text-blue-500 text-xs">
//                         <EditOutlined /> {/* Ant Design Edit Icon */}
//                       </button>
//                       <button onClick={() => handleDeleteEvent(dayEvents[0]._id)} className="text-red-500 text-xs">
//                         <DeleteOutlined /> {/* Ant Design Delete Icon */}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       );
//     } else if (viewType === 'week') {
//       // Render week view (not implemented)
//       return (
//         <div className="grid grid-cols-7 gap-4 text-center mb-6">
//           <div className="font-bold">Sun</div>
//           <div className="font-bold">Mon</div>
//           <div className="font-bold">Tue</div>
//           <div className="font-bold">Wed</div>
//           <div className="font-bold">Thu</div>
//           <div className="font-bold">Fri</div>
//           <div className="font-bold">Sat</div>
//           {Array.from({ length: 7 }).map((_, index) => (
//             <div
//               key={index}
//               className="border p-2 h-20 flex justify-center items-center"
//             >
//               Day {index + 1}
//             </div>
//           ))}
//         </div>
//       );
//     }
//   };
  
//   return (
//     <div className="p-5">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Events</h1>
//         <div className="flex items-center space-x-4">
//           {/* Month Navigation */}
//           <button
//             className="p-2 bg-gray-200 rounded"
//             onClick={() => handleMonthNavigation('prev')}
//           >
//             &larr; {/* Left arrow */}
//           </button>
//           <input
//             type="month"
//             value={selectedMonth}
//             onChange={handleMonthChange}
//             className="form-control p-2 border border-gray-300 rounded"
//           />
//           <button
//             className="p-2 bg-gray-200 rounded"
//             onClick={() => handleMonthNavigation('next')}
//           >
//             &rarr; {/* Right arrow */}
//           </button>

//           {/* Add New Event */}
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//             onClick={() => {
//               resetForm();
//               setShowPopup(true);
//             }}
//           >
//             New Event
//           </button>
//         </div>
//       </div>

//       {/* Toggle View Buttons */}
//       <div className="mb-4">
//         <button
//           className={`px-4 py-2 ${viewType === 'month' ? 'bg-gray-800 text-white' : 'bg-gray-200'} mr-2`}
//           onClick={() => handleViewToggle('month')}
//         >
//           Month View
//         </button>
//         <button
//           className={`px-4 py-2 ${viewType === 'week' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
//           onClick={() => handleViewToggle('week')}
//         >
//           Week View
//         </button>
//       </div>

//       {/* Calendar Rendering */}
//       {renderCalendar()}

//       {/* Popup for Adding or Editing Event */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">{isEditing ? 'Edit Event' : 'New Event'}</h2>
//               <button onClick={resetForm} className="text-gray-600 font-bold text-xl">&times;</button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium">Title:*</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={newEvent.title}
//                   onChange={handleInputChange}
//                   className="mt-1 p-2 border border-gray-300 rounded w-full"
//                   placeholder="Enter event title"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium">Start Date:*</label>
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={newEvent.startDate}
//                     onChange={handleInputChange}
//                     className="mt-1 p-2 border border-gray-300 rounded w-full"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium">End Date:*</label>
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={newEvent.endDate}
//                     onChange={handleInputChange}
//                     className="mt-1 p-2 border border-gray-300 rounded w-full"
//                     required
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Type:*</label>
//                 <select
//                   name="type"
//                   value={newEvent.type}
//                   onChange={handleInputChange}
//                   className="mt-1 p-2 border border-gray-300 rounded w-full"
//                   required
//                 >
//                   <option value="">Select event type</option>
//                   <option value="Meeting">Meeting</option>
//                   <option value="Conference">Conference</option>
//                   <option value="Webinar">Webinar</option>
//                   <option value="Workshop">Workshop</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Description:</label>
//                 <textarea
//                   name="description"
//                   value={newEvent.description}
//                   onChange={handleInputChange}
//                   className="mt-1 p-2 border border-gray-300 rounded w-full"
//                   rows="3"
//                   placeholder="Add Event description..."
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end mt-6 space-x-4">
//               <button
//                 onClick={resetForm}
//                 className="px-4 py-2 border border-gray-300 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddEvent}
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//               >
//                 {isEditing ? 'Update Event' : 'Add Event'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Events;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { gapi } from 'gapi-script'; // Google API library for browser

const Events = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewType, setViewType] = useState('month'); 
  const [selectedMonth, setSelectedMonth] = useState('2024-10'); 
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    endDate: '',
    type: '',
    description: ''
  });
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);

  // Your Google API credentials (Replace with actual Client ID and API key)
  const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
  const API_KEY = 'YOUR_GOOGLE_API_KEY';

  // Scope for Google Calendar API (this allows creating events and generating Google Meet links)
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

  // Fetch events from the backend API
  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://task-manager-backend-btas.onrender.com/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    handleClientLoad(); // Initialize Google API client
  }, []);

  // Google API client initialization
  const handleClientLoad = () => {
    gapi.load('client:auth2', initClient);
  };

  // Initialize the Google API client with the API key and client ID
  const initClient = () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: SCOPES
    });
  };

  // Function to handle Google authentication
  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  // Function to create an event in Google Calendar with a Google Meet link
  const createGoogleCalendarEvent = async (eventDetails) => {
    const event = {
      summary: eventDetails.title,
      description: eventDetails.description,
      start: {
        dateTime: `${eventDetails.startDate}T09:00:00`, // Adjust time as necessary
        timeZone: 'America/Los_Angeles' // Adjust timezone as necessary
      },
      end: {
        dateTime: `${eventDetails.endDate}T10:00:00`, // Adjust time as necessary
        timeZone: 'America/Los_Angeles' // Adjust timezone as necessary
      },
      conferenceData: {
        createRequest: {
          requestId: 'some-random-string', // Unique request ID for creating Meet link
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    try {
      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1, // Required to generate a Google Meet link
      });
      const response = await request.execute();
      return response;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleAddEvent = async () => {
    try {
      if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        await handleAuthClick(); // Authenticate if not already signed in
      }

      // Add or update event in your backend
      if (isEditing) {
        await axios.put(`https://task-manager-backend-btas.onrender.com/api/events/${editingEventId}`, newEvent);
      } else {
        await axios.post('https://task-manager-backend-btas.onrender.com/api/events', newEvent);
      }

      // Create the event in Google Calendar and attach a Google Meet link
      const googleCalendarEvent = await createGoogleCalendarEvent(newEvent);
      if (googleCalendarEvent && googleCalendarEvent.hangoutLink) {
        alert(`Google Meet link created: ${googleCalendarEvent.hangoutLink}`);
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error adding/updating event:', error);
    }
  };

  const handleEditEvent = (event) => {
    setNewEvent({
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      type: event.type,
      description: event.description
    });
    setEditingEventId(event._id);
    setIsEditing(true);
    setShowPopup(true);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`https://task-manager-backend-btas.onrender.com/api/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      startDate: '',
      endDate: '',
      type: '',
      description: ''
    });
    setEditingEventId(null);
    setIsEditing(false);
    setShowPopup(false);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleViewToggle = (view) => {
    setViewType(view);
  };

  const handleMonthNavigation = (direction) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    let newYear = year;
    let newMonth = month;

    if (direction === 'prev') {
      newMonth -= 1;
      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }
    } else if (direction === 'next') {
      newMonth += 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }
    }
    const newDate = `${newYear}-${String(newMonth).padStart(2, '0')}`;
    setSelectedMonth(newDate);
  };

  const renderCalendar = () => {
    const numDays = new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1], 0).getDate();
    const firstDay = new Date(selectedMonth + '-01').getDay();
    const calendarDays = Array.from({ length: numDays }, (_, index) => index + 1);

    if (viewType === 'month') {
      return (
        <div className="grid grid-cols-7 gap-4 text-center mb-6">
          <div className="font-bold text-white bg-red-500 p-2">Sun</div>
          <div className="font-bold text-white bg-blue-500 p-2">Mon</div>
          <div className="font-bold text-white bg-blue-500 p-2">Tue</div>
          <div className="font-bold text-white bg-blue-500 p-2">Wed</div>
          <div className="font-bold text-white bg-blue-500 p-2">Thu</div>
          <div className="font-bold text-white bg-blue-500 p-2">Fri</div>
          <div className="font-bold text-white bg-blue-500 p-2">Sat</div>
          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={index} className="border p-2 h-20"></div>
          ))}
          {calendarDays.map((day) => {
            const dayEvents = events.filter(event => {
              const eventStart = new Date(event.startDate);
              const eventEnd = new Date(event.endDate);
              return (
                eventStart.getFullYear() === Number(selectedMonth.split('-')[0]) &&
                eventStart.getMonth() === Number(selectedMonth.split('-')[1]) - 1 &&
                eventEnd.getFullYear() === Number(selectedMonth.split('-')[0]) &&
                eventEnd.getMonth() === Number(selectedMonth.split('-')[1]) - 1 &&
                (eventStart.getDate() <= day && eventEnd.getDate() >= day)
              );
            });

            return (
              <div key={day} className="border p-2 h-20 relative">
                {day}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 text-sm bg-yellow-500 text-white p-1">
                    {dayEvents.length} event{dayEvents.length > 1 && 's'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div className="w-full p-10">
      <h1 className="text-4xl font-bold mb-6">Events</h1>
      <div className="flex justify-between mb-4">
        <div>
          <button onClick={() => handleMonthNavigation('prev')} className="px-4 py-2 bg-blue-500 text-white mr-2">Prev</button>
          <button onClick={() => handleMonthNavigation('next')} className="px-4 py-2 bg-blue-500 text-white">Next</button>
        </div>
        <div className="flex items-center">
          <label className="mr-2">Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border px-4 py-2 mr-4"
          />
          <button
            onClick={() => handleViewToggle(viewType === 'month' ? 'list' : 'month')}
            className="px-4 py-2 bg-green-500 text-white"
          >
            {viewType === 'month' ? 'List View' : 'Month View'}
          </button>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="px-4 py-2 bg-blue-500 text-white"
        >
          Add Event
        </button>
      </div>

      {renderCalendar()}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Event' : 'Add New Event'}</h2>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Event Title"
              className="border p-2 w-full mb-4"
            />
            <input
              type="datetime-local"
              name="startDate"
              value={newEvent.startDate}
              onChange={handleInputChange}
              placeholder="Start Date"
              className="border p-2 w-full mb-4"
            />
            <input
              type="datetime-local"
              name="endDate"
              value={newEvent.endDate}
              onChange={handleInputChange}
              placeholder="End Date"
              className="border p-2 w-full mb-4"
            />
            <input
              type="text"
              name="type"
              value={newEvent.type}
              onChange={handleInputChange}
              placeholder="Event Type"
              className="border p-2 w-full mb-4"
            />
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Event Description"
              className="border p-2 w-full mb-4"
            ></textarea>
            <div className="flex justify-between">
            <button
                onClick={resetForm}
                className="px-4 py-2 bg-red-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-blue-500 text-white"
              >
                {isEditing ? 'Update' : 'Add'} Event
              </button>
             
            </div>
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Event List</h2>
        <ul>
          {events.map((event) => (
            <li key={event._id} className="flex justify-between items-center mb-2">
              <div>
                <span className="font-bold">{event.title}</span> - {event.startDate} to {event.endDate}
              </div>
              <div>
                <EditOutlined
                  onClick={() => handleEditEvent(event)}
                  className="text-blue-500 cursor-pointer mr-4"
                />
                <DeleteOutlined
                  onClick={() => handleDeleteEvent(event._id)}
                  className="text-red-500 cursor-pointer"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Events;
