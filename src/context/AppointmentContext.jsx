import { createContext, useContext, useState } from 'react';

const AppointmentContext = createContext(null);

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('mindcare_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const addAppointment = (appointment) => {
    const newAppointment = {
      id: Date.now(),
      ...appointment,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    localStorage.setItem('mindcare_appointments', JSON.stringify(updated));
    return newAppointment;
  };

  const cancelAppointment = (id) => {
    const updated = appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'cancelled' } : apt
    );
    setAppointments(updated);
    localStorage.setItem('mindcare_appointments', JSON.stringify(updated));
  };

  const completeAppointment = (id) => {
    const updated = appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'completed' } : apt
    );
    setAppointments(updated);
    localStorage.setItem('mindcare_appointments', JSON.stringify(updated));
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, cancelAppointment, completeAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error('useAppointments must be used within AppointmentProvider');
  return context;
};