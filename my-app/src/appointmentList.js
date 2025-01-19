import React, { useEffect, useState } from "react";
import { getAppointments } from "./apiService"; // This is a separate file

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, []); // The empty dependency array ensures this runs only once

  return (
    <div>
      <h1>Appointments</h1>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>{appointment.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsList;
